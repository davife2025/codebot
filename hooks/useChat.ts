"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Conversation, ModelOption } from "@/lib/types";

const FALLBACK_MODEL = "claude-sonnet-5";

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeConversation(model: string): Conversation {
  return {
    id: makeId(),
    title: "New chat",
    model,
    messages: [],
    createdAt: Date.now(),
  };
}

export function useChat() {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const initialized = useRef(false);

  // Load the live model list once, then seed the first conversation.
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

        const defaultModel = list[0]?.id || FALLBACK_MODEL;
        const first = makeConversation(defaultModel);
        setConversations([first]);
        setActiveId(first.id);
      })
      .catch((err) => {
        setModelsError(err instanceof Error ? err.message : "Failed to load models");
        const first = makeConversation(FALLBACK_MODEL);
        setConversations([first]);
        setActiveId(first.id);
      });
  }, []);

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

  const setActiveModel = useCallback(
    (model: string) => {
      if (!activeId) return;
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, model } : c))
      );
    },
    [activeId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeId || !content.trim() || sending) return;
      setSendError(null);

      const conversationId = activeId;
      const userMessage: ChatMessage = { id: makeId(), role: "user", content };
      const assistantId = makeId();
      const modelForRequest =
        conversations.find((c) => c.id === conversationId)?.model ||
        models[0]?.id ||
        FALLBACK_MODEL;

      let historyForRequest: ChatMessage[] = [];

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const nextMessages = [
            ...c.messages,
            userMessage,
            { id: assistantId, role: "assistant" as const, content: "", model: c.model, pending: true },
          ];
          historyForRequest = [...c.messages, userMessage];
          return {
            ...c,
            title: c.title === "New chat" ? content.slice(0, 48) : c.title,
            messages: nextMessages,
          };
        })
      );

      setSending(true);

      const updateAssistant = (updater: (msg: ChatMessage) => ChatMessage) => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id !== conversationId
              ? c
              : {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantId ? updater(m) : m
                  ),
                }
          )
        );
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelForRequest,
            messages: historyForRequest.map((m) => ({ role: m.role, content: m.content })),
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
                updateAssistant((m) => ({ ...m, content: m.content + delta }));
              }
            } catch {
              // Ignore malformed SSE fragments; streaming continues.
            }
          }
        }

        updateAssistant((m) => ({ ...m, pending: false }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setSendError(message);
        updateAssistant((m) => ({ ...m, pending: false, content: m.content || `Error: ${message}` }));
      } finally {
        setSending(false);
      }
    },
    [activeId, conversations, models, sending]
  );

  return {
    models,
    modelsError,
    conversations,
    activeConversation,
    newConversation,
    selectConversation,
    setActiveModel,
    sendMessage,
    sending,
    sendError,
  };
}
