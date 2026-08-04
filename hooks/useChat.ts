"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Conversation, ModelOption } from "@/lib/types";
import { buildApiHistory } from "@/lib/messages";
import { loadActiveId, loadConversations, saveActiveId, saveConversations } from "@/lib/storage";
import {
  deleteRemoteConversation,
  ensureAnonymousSession,
  fetchRemoteConversations,
  upsertRemoteConversation,
} from "@/lib/cloudSync";
import { isCloudSyncEnabled } from "@/lib/supabaseClient";

// AgentRouter model IDs are dated/versioned (e.g. "claude-sonnet-4-5-20250929"),
// never confirmed against a live catalog from this environment. Only used if
// /api/models fails outright. Override with NEXT_PUBLIC_DEFAULT_MODEL once
// you know the exact id your AgentRouter account exposes.
const FALLBACK_MODEL = process.env.NEXT_PUBLIC_DEFAULT_MODEL || "claude-sonnet-4-5-20250929";

// A hung request shouldn't lock the UI forever.
const REQUEST_TIMEOUT_MS = 120_000;

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
  // Per-conversation, not global — sending in one chat must not block
  // sending in another.
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [sendErrors, setSendErrors] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const initialized = useRef(false);
  const syncTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // assistantId -> its in-flight request's controller
  const controllers = useRef<Record<string, AbortController>>({});
  // conversationId -> assistantIds currently streaming into it (for stop)
  const activeStreams = useRef<Record<string, string[]>>({});

  const markSending = useCallback((conversationId: string, isSending: boolean) => {
    setSendingIds((prev) => {
      const next = new Set(prev);
      if (isSending) next.add(conversationId);
      else next.delete(conversationId);
      return next;
    });
  }, []);

  const setConversationError = useCallback((conversationId: string, message: string | null) => {
    setSendErrors((prev) => {
      const next = { ...prev };
      if (message) next[conversationId] = message;
      else delete next[conversationId];
      return next;
    });
  }, []);

  // Load the live model list once, then — if cloud sync is configured — sign
  // in anonymously and merge remote conversations with whatever was restored
  // from localStorage. Falls back to local-only if Supabase isn't set up or
  // the anonymous session can't be established.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Snapshot the state this effect was mounted with — this closure only
    // ever runs once, so these are exactly the values from the initial
    // (possibly localStorage-restored) render.
    const localSnapshot = conversations;
    const activeIdSnapshot = activeId;

    (async () => {
      let modelList: ModelOption[] = [];
      try {
        const res = await fetch("/api/models");
        const data: { models?: ModelOption[]; error?: string } = await res.json();
        if (data.error) setModelsError(data.error);
        modelList = data.models && data.models.length > 0 ? data.models : [];
        setModels(modelList);
      } catch (err) {
        setModelsError(err instanceof Error ? err.message : "Failed to load models");
      }

      const seedDefault = () => {
        const defaultModel = modelList[0]?.id || FALLBACK_MODEL;
        const first = makeConversation(defaultModel);
        setConversations([first]);
        setActiveId(first.id);
      };

      if (!isCloudSyncEnabled()) {
        if (localSnapshot.length === 0) seedDefault();
        return;
      }

      const uid = await ensureAnonymousSession();
      if (!uid) {
        setCloudError(
          "Couldn't start a Supabase session — check NEXT_PUBLIC_SUPABASE_* env vars and that anonymous sign-ins are enabled. Continuing with local-only storage."
        );
        if (localSnapshot.length === 0) seedDefault();
        return;
      }

      setUserId(uid);
      const remote = await fetchRemoteConversations(uid);
      const remoteIds = new Set(remote.map((c) => c.id));
      const localOnly = localSnapshot.filter((c) => !remoteIds.has(c.id));
      localOnly.forEach((c) => {
        upsertRemoteConversation(uid, c);
      });

      const merged = [...remote, ...localOnly].sort((a, b) => b.createdAt - a.createdAt);

      if (merged.length === 0) {
        seedDefault();
        return;
      }

      setConversations(merged);
      if (!activeIdSnapshot || !merged.some((c) => c.id === activeIdSnapshot)) {
        setActiveId(merged[0].id);
      }
    })();
    // Intentionally mount-only: this reads `conversations`/`activeId` as a
    // one-time snapshot to merge with remote data, then never runs again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage whenever conversations or the active chat change
  // — this stays on even with cloud sync enabled, as a fast local cache and
  // an offline fallback.
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  // Push changes to Supabase, debounced per-conversation so a streaming
  // response doesn't fire a write on every token — only once things settle.
  useEffect(() => {
    if (!userId) return;
    conversations.forEach((c) => {
      if (syncTimers.current[c.id]) clearTimeout(syncTimers.current[c.id]);
      syncTimers.current[c.id] = setTimeout(() => {
        upsertRemoteConversation(userId, c);
      }, 1000);
    });
  }, [conversations, userId]);

  // Clear any pending debounced syncs and in-flight requests on unmount.
  useEffect(() => {
    const timers = syncTimers.current;
    const liveControllers = controllers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
      Object.values(liveControllers).forEach((c) => c.abort("unmount"));
    };
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

  const deleteConversation = useCallback(
    (id: string) => {
      (activeStreams.current[id] || []).forEach((assistantId) => {
        controllers.current[assistantId]?.abort("deleted");
      });
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (id === activeId) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
      if (userId) deleteRemoteConversation(userId, id);
    },
    [activeId, userId]
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
      const controller = new AbortController();
      controllers.current[assistantId] = controller;
      activeStreams.current[conversationId] = [
        ...(activeStreams.current[conversationId] || []),
        assistantId,
      ];
      const timeoutId = setTimeout(() => controller.abort("timeout"), REQUEST_TIMEOUT_MS);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: buildApiHistory(history) }),
          signal: controller.signal,
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

            let parsed: unknown;
            try {
              parsed = JSON.parse(payload);
            } catch {
              continue; // malformed fragment — skip, don't abort the stream
            }

            const obj = parsed as {
              error?: string | { message?: string };
              choices?: Array<{ delta?: { content?: string } }>;
            };

            // Unlike a malformed fragment, an explicit error from the
            // provider must not be swallowed — surface it as a real failure.
            if (obj?.error) {
              const msg = typeof obj.error === "string" ? obj.error : obj.error?.message;
              throw new Error(msg || "The model returned an error mid-response.");
            }

            const delta = obj?.choices?.[0]?.delta?.content;
            if (delta) {
              updateMessage(conversationId, assistantId, (m) => ({
                ...m,
                content: m.content + delta,
              }));
            }
          }
        }

        updateMessage(conversationId, assistantId, (m) => ({ ...m, pending: false }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          const reason = controller.signal.reason;
          const message =
            reason === "timeout"
              ? `Timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`
              : "Stopped.";
          updateMessage(conversationId, assistantId, (m) => ({
            ...m,
            pending: false,
            content: m.content || message,
          }));
          if (reason === "timeout") setConversationError(conversationId, message);
        } else {
          const message = err instanceof Error ? err.message : "Something went wrong";
          setConversationError(conversationId, message);
          updateMessage(conversationId, assistantId, (m) => ({
            ...m,
            pending: false,
            content: m.content || `Error: ${message}`,
          }));
        }
      } finally {
        clearTimeout(timeoutId);
        delete controllers.current[assistantId];
        activeStreams.current[conversationId] = (
          activeStreams.current[conversationId] || []
        ).filter((id) => id !== assistantId);
      }
    },
    [updateMessage, setConversationError]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeId || !content.trim() || sendingIds.has(activeId)) return;
      const conversationId = activeId;
      setConversationError(conversationId, null);

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

      markSending(conversationId, true);

      const tasks = [streamOne(conversationId, modelA, historyForRequest, assistantAId)];
      if (modelB && assistantBId) {
        tasks.push(streamOne(conversationId, modelB, historyForRequest, assistantBId));
      }

      await Promise.all(tasks);
      markSending(conversationId, false);
    },
    [activeId, conversations, sendingIds, streamOne, markSending, setConversationError]
  );

  const regenerateMessage = useCallback(
    async (assistantId: string) => {
      if (!activeId || sendingIds.has(activeId)) return;
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

      setConversationError(conversationId, null);
      updateMessage(conversationId, assistantId, (m) => ({ ...m, content: "", pending: true }));
      markSending(conversationId, true);
      await streamOne(conversationId, model, history, assistantId);
      markSending(conversationId, false);
    },
    [activeId, conversations, sendingIds, streamOne, updateMessage, markSending, setConversationError]
  );

  const editMessage = useCallback(
    (userMessageId: string, newContent: string) => {
      if (!activeId || sendingIds.has(activeId) || !newContent.trim()) return;
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
    [activeId, sendingIds, sendMessage]
  );

  const stopGeneration = useCallback((conversationId: string) => {
    (activeStreams.current[conversationId] || []).forEach((assistantId) => {
      controllers.current[assistantId]?.abort("user");
    });
  }, []);

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
    stopGeneration,
    // Scoped to the active conversation for the UI's convenience — other
    // conversations can keep streaming independently in the background.
    sending: activeId ? sendingIds.has(activeId) : false,
    sendError: activeId ? sendErrors[activeId] ?? null : null,
    cloudSynced: Boolean(userId),
    cloudError,
  };
}
