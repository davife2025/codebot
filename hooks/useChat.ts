"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Conversation, ModelOption } from "@/lib/types";
import { loadActiveId, loadConversations, saveActiveId, saveConversations } from "@/lib/storage";

const FALLBACK_MODEL = "claude-sonnet-5";

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeConversation(model: string): Conversation {
  return {
    id: makeId(),
    title: "New chat",
    model,
    compareModel: null,
    messages: [],
    createdAt: Date.now(),
  };
}

export function useChat() {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(
    () => loadConversations() ?? []
  );
  const [activeId, setActiveId] = useState<string | null>(() => {
    const restored = loadConversations();
    if (!restored || restored.length === 0) return null;
    const storedActive = loadActiveId();
    return storedActive && restored.some((c) => c.id === storedActive)
      ? storedActive
      : restored[0].id;
  });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const initialized = useRef(false);
  const hasRestored = useRef(conversations.length > 0);

  // Load the live model list once. If nothing was restored from storage,
  // seed a first conversation once we know which models are available.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetch("/api/models")
      .then((res) => res.json())
      .then((data: { models?: ModelOption[]; error?: string }) => {
        if (data.error) {
          setModelsError(data.error);
        }
        const list = data.models && data.models.length > 0 ? data.models : [];
        setModels(list);

        if (!hasRestored.current) {
          const defaultModel = list[0]?.id || FALLBACK_MODEL;
          const first = makeConversation(defaultModel);
          setConversations([first]);
          setActiveId(first.id);
        }
      })
      .catch((err) => {
        setModelsError(err instanceof Error ? err.message : "Failed to load models");
        if (!hasRestored.current) {
          const first = makeConversation(FALLBACK_MODEL);
          setConversations([first]);
          setActiveId(first.id);
        }
      });
  }, []);

  // Persist to localStorage whenever conversations or the active chat change.
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const newConversation = useCallback(() => {
    const model = activeConversation?.model || models[0]?.id || FALLBACK_MODEL;
    const conv = makeConversation(model);
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  }, [activeConversation, models]);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (id === activeId) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeId]
  );

  const setActiveModel = useCallback(
    (model: string) => {
      if (!activeId) return;
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, model } : c))
      );
    },
    [activeId]
  );

  const setCompareModel = useCallback(
    (model: string | null) => {
      if (!activeId) return;
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, compareModel: model } : c))
      );
    },
    [activeId]
  );

  const updateMessage = useCallback(
    (conversationId: string, id: string, updater: (msg: ChatMessage) => ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== conversationId
            ? c
            : { ...c, messages: c.messages.map((m) => (m.id === id ? updater(m) : m)) }
        )
      );
    },
    []
  );

  const streamOne = useCallback(
    async (
      conversationId: string,
      model: string,
      history: ChatMessage[],
      assistantId: string
    ) => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(data.error || `Request failed with status ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const delta: string | undefined = parsed?.choices?.[0]?.delta?.content;
              if (delta) {
                updateMessage(conversationId, assistantId, (m) => ({
                  ...m,
                  content: m.content + delta,
                }));
              }
            } catch {
              // Ignore malformed SSE fragments; streaming continues.
            }
          }
        }

        updateMessage(conversationId, assistantId, (m) => ({ ...m, pending: false }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setSendError(message);
        updateMessage(conversationId, assistantId, (m) => ({
          ...m,
          pending: false,
          content: m.content || `Error: ${message}`,
        }));
      }
    },
    [updateMessage]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeId || !content.trim() || sending) return;
      setSendError(null);

      const conversationId = activeId;
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      const turnId = makeId();
      const userMessage: ChatMessage = { id: makeId(), role: "user", content };
      const assistantAId = makeId();
      const modelA = conversation.model;
      const modelB = conversation.compareModel || null;
      const assistantBId = modelB ? makeId() : null;

      let historyForRequest: ChatMessage[] = [];

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const newAssistants: ChatMessage[] = [
            { id: assistantAId, role: "assistant", content: "", model: modelA, pending: true, turnId },
          ];
          if (modelB && assistantBId) {
            newAssistants.push({
              id: assistantBId,
              role: "assistant",
              content: "",
              model: modelB,
              pending: true,
              turnId,
            });
          }
          historyForRequest = [...c.messages, userMessage];
          return {
            ...c,
            title: c.title === "New chat" ? content.slice(0, 48) : c.title,
            messages: [...c.messages, userMessage, ...newAssistants],
          };
        })
      );

      setSending(true);

      const tasks = [streamOne(conversationId, modelA, historyForRequest, assistantAId)];
      if (modelB && assistantBId) {
        tasks.push(streamOne(conversationId, modelB, historyForRequest, assistantBId));
      }

      await Promise.all(tasks);
      setSending(false);
    },
    [activeId, conversations, sending, streamOne]
  );

  const regenerateMessage = useCallback(
    async (assistantId: string) => {
      if (!activeId || sending) return;
      const conversation = conversations.find((c) => c.id === activeId);
      if (!conversation) return;

      const idx = conversation.messages.findIndex((m) => m.id === assistantId);
      if (idx === -1) return;

      let userIdx = idx - 1;
      while (userIdx >= 0 && conversation.messages[userIdx].role !== "user") userIdx--;
      if (userIdx < 0) return;

      const conversationId = activeId;
      const history = conversation.messages.slice(0, userIdx + 1);
      const model = conversation.messages[idx].model || conversation.model;

      setSendError(null);
      updateMessage(conversationId, assistantId, (m) => ({ ...m, content: "", pending: true }));
      setSending(true);
      await streamOne(conversationId, model, history, assistantId);
      setSending(false);
    },
    [activeId, conversations, sending, streamOne, updateMessage]
  );

  const editMessage = useCallback(
    (userMessageId: string, newContent: string) => {
      if (!activeId || sending || !newContent.trim()) return;
      const conversationId = activeId;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const idx = c.messages.findIndex((m) => m.id === userMessageId);
          if (idx === -1) return c;
          return { ...c, messages: c.messages.slice(0, idx) };
        })
      );

      sendMessage(newContent);
    },
    [activeId, sending, sendMessage]
  );

  return {
    models,
    modelsError,
    conversations,
    activeConversation,
    newConversation,
    selectConversation,
    deleteConversation,
    setActiveModel,
    setCompareModel,
    sendMessage,
    regenerateMessage,
    editMessage,
    sending,
    sendError,
  };
}
