import type { Conversation } from "./types";

const CONVERSATIONS_KEY = "agent-chat:conversations:v1";
const ACTIVE_ID_KEY = "agent-chat:active-id:v1";

export function loadConversations(): Conversation[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    // A message left "pending" means the tab closed mid-stream. There's no
    // connection to resume it, so finalize it as-is rather than showing a
    // permanent typing indicator.
    return (parsed as Conversation[]).map((c) => ({
      ...c,
      messages: Array.isArray(c.messages)
        ? c.messages.map((m) => ({ ...m, pending: false }))
        : [],
    }));
  } catch {
    return null;
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently,
    // the app keeps working in memory for the rest of the session.
  }
}

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_ID_KEY);
}

export function saveActiveId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_ID_KEY, id);
    else window.localStorage.removeItem(ACTIVE_ID_KEY);
  } catch {
    // Ignore — same reasoning as saveConversations.
  }
}
