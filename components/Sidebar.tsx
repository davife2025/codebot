"use client";

import type { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew }: SidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-1 border-r border-[var(--border)] bg-[var(--surface-1)] p-3">
      <button
        onClick={onNew}
        className="mb-3 flex items-center justify-start gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-2)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New chat
      </button>

      <div className="px-2 pb-1 text-xs text-[var(--text-muted)]">Recent</div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            title={c.title}
            className={`truncate rounded-lg px-3 py-2 text-left text-sm ${
              c.id === activeId
                ? "bg-[var(--surface-2)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {c.title}
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="px-3 py-2 text-sm text-[var(--text-muted)]">No chats yet</p>
        )}
      </div>
    </aside>
  );
}
