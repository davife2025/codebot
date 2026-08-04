"use client";

import type { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, open, onClose }: SidebarProps) {
  const handleSelect = (id: string) => {
    onSelect(id);
    onClose(); // no-op on desktop widths; closes the drawer on mobile
  };

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-10 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 shrink-0 -translate-x-full flex-col gap-1 border-r border-[var(--border)] bg-[var(--surface-1)] p-3 transition-transform duration-200 md:relative md:z-auto md:w-60 md:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={onNew}
            className="flex flex-1 items-center justify-start gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-2)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-2 pb-1 text-xs text-[var(--text-muted)]">Recent</div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-1 rounded-lg pr-1 ${
                c.id === activeId ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]"
              }`}
            >
              <button
                onClick={() => handleSelect(c.id)}
                title={c.title}
                className={`flex-1 truncate rounded-lg px-3 py-2 text-left text-sm ${
                  c.id === activeId ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {c.title}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                aria-label={`Delete ${c.title}`}
                className="hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-0)] hover:text-[var(--text-primary)] group-hover:flex [@media(hover:none)]:flex"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                </svg>
              </button>
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="px-3 py-2 text-sm text-[var(--text-muted)]">No chats yet</p>
          )}
        </div>
      </aside>
    </>
  );
}
