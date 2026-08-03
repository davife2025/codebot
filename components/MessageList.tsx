"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]">
        Ask anything. Switch models any time from the dropdown above.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="flex justify-end">
            <div className="max-w-[70%] rounded-xl bg-[var(--surface-2)] px-3.5 py-2.5 text-sm leading-relaxed">
              {m.content}
            </div>
          </div>
        ) : (
          <div key={m.id} className="max-w-[78%]">
            <div className="mb-1 text-xs text-[var(--text-muted)]">{m.model}</div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
              {m.content || (m.pending ? <TypingDots /> : "")}
            </div>
          </div>
        )
      )}
      <div ref={bottomRef} />
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
