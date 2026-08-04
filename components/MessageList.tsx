"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { groupMessages } from "@/lib/messages";

interface MessageListProps {
  messages: ChatMessage[];
  onRegenerate: (assistantId: string) => void;
  onEditUser: (userMessageId: string, newContent: string) => void;
  sending: boolean;
}

export function MessageList({ messages, onRegenerate, onEditUser, sending }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const copy = (id: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    });
  };

  const startEdit = (m: ChatMessage) => {
    setEditingId(m.id);
    setDraft(m.content);
  };

  const saveEdit = (id: string) => {
    if (draft.trim()) onEditUser(id, draft.trim());
    setEditingId(null);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]">
        Ask anything. Switch models any time from the dropdown above.
      </div>
    );
  }

  const groups = groupMessages(messages);

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
      {groups.map((group) => {
        const first = group[0];

        if (first.role === "user") {
          const isEditing = editingId === first.id;
          return (
            <div key={first.id} className="group flex justify-end">
              {isEditing ? (
                <div className="w-full max-w-[70%] rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={Math.min(6, Math.max(2, draft.split("\n").length))}
                    className="w-full resize-none border-none bg-transparent p-1.5 text-sm shadow-none focus:shadow-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(first.id)}
                      className="rounded-lg bg-[var(--text-primary)] px-2.5 py-1 text-xs text-[var(--surface-0)]"
                    >
                      Save &amp; resend
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-1.5">
                  <button
                    onClick={() => startEdit(first)}
                    aria-label="Edit message"
                    className="mt-2.5 hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] group-hover:flex [@media(hover:none)]:flex"
                  >
                    <PencilIcon />
                  </button>
                  <div className="max-w-[70%] rounded-xl bg-[var(--surface-2)] px-3.5 py-2.5 text-sm leading-relaxed">
                    {first.content}
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (group.length > 1) {
          return (
            <div key={first.turnId} className="grid grid-cols-2 gap-4">
              {group.map((m) => (
                <AssistantBubble
                  key={m.id}
                  message={m}
                  bordered
                  sending={sending}
                  copied={copiedId === m.id}
                  onCopy={() => copy(m.id, m.content)}
                  onRegenerate={() => onRegenerate(m.id)}
                />
              ))}
            </div>
          );
        }

        return (
          <AssistantBubble
            key={first.id}
            message={first}
            sending={sending}
            copied={copiedId === first.id}
            onCopy={() => copy(first.id, first.content)}
            onRegenerate={() => onRegenerate(first.id)}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

function AssistantBubble({
  message,
  bordered,
  sending,
  copied,
  onCopy,
  onRegenerate,
}: {
  message: ChatMessage;
  bordered?: boolean;
  sending: boolean;
  copied: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div
      className={`group min-w-0 max-w-[78%] ${bordered ? "rounded-lg border border-[var(--border)] p-3" : ""}`}
    >
      <div className="mb-1 text-xs font-medium text-[var(--text-muted)]">{message.model}</div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
        {message.content || (message.pending ? <TypingDots /> : "")}
      </div>
      {!message.pending && message.content && (
        <div className="mt-1.5 hidden items-center gap-1 group-hover:flex [@media(hover:none)]:flex">
          <button
            onClick={onCopy}
            aria-label="Copy message"
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button
            onClick={onRegenerate}
            disabled={sending}
            aria-label="Regenerate response"
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] disabled:opacity-30"
          >
            <RegenerateIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:0.2s]" />
    </span>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function RegenerateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
