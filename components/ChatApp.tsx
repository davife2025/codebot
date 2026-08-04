"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/Sidebar";
import { ModelSelector } from "@/components/ModelSelector";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { ThemeToggle } from "@/components/ThemeToggle";

export function ChatApp() {
  const {
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
    sending,
    sendError,
    cloudSynced,
    cloudError,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const enableCompare = () => {
    if (!activeConversation) return;
    const fallback =
      models.find((m) => m.id !== activeConversation.model)?.id ||
      models[0]?.id ||
      activeConversation.model;
    setCompareModel(fallback);
  };

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={conversations}
        activeId={activeConversation?.id ?? null}
        onSelect={selectConversation}
        onNew={newConversation}
        onDelete={deleteConversation}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-2)] md:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            {activeConversation ? (
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
                <ModelSelector
                  models={models}
                  value={activeConversation.model}
                  onChange={setActiveModel}
                />
                {activeConversation.compareModel ? (
                  <>
                    <span className="shrink-0 text-xs text-[var(--text-muted)]">vs</span>
                    <ModelSelector
                      models={models}
                      value={activeConversation.compareModel}
                      onChange={setCompareModel}
                    />
                    <button
                      onClick={() => setCompareModel(null)}
                      aria-label="Exit compare mode"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={enableCompare}
                    className="shrink-0 rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                  >
                    + Compare
                  </button>
                )}
              </div>
            ) : (
              <span className="text-sm text-[var(--text-muted)]">
                {models.length === 0 && !modelsError ? "Loading models..." : "No chat selected"}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {cloudSynced && (
              <span
                title="Synced to your Supabase account"
                className="hidden items-center gap-1 text-xs text-[var(--text-muted)] sm:flex"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>
                Synced
              </span>
            )}
            <ThemeToggle />
          </div>
        </header>

        {cloudError && (
          <div className="border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 text-xs text-[var(--text-secondary)]">
            {cloudError}
          </div>
        )}

        {modelsError && (
          <div className="border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 text-xs text-[var(--text-secondary)]">
            Couldn&apos;t load the live model list ({modelsError}). Set AGENTROUTER_API_KEY in .env.local.
          </div>
        )}

        <MessageList
          messages={activeConversation?.messages ?? []}
          onRegenerate={regenerateMessage}
          onEditUser={editMessage}
          sending={sending}
        />

        {sendError && (
          <div className="px-4 pb-1 text-xs text-red-500">{sendError}</div>
        )}

        <ChatInput
          onSend={sendMessage}
          onStop={() => activeConversation && stopGeneration(activeConversation.id)}
          sending={sending}
          disabled={!activeConversation}
          placeholder={
            activeConversation
              ? activeConversation.compareModel
                ? `Ask ${activeConversation.model} & ${activeConversation.compareModel}`
                : `Message ${activeConversation.model}`
              : "Message..."
          }
        />
      </div>
    </div>
  );
}
