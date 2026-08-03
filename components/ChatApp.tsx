"use client";

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
    setActiveModel,
    sendMessage,
    sending,
    sendError,
  } = useChat();

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={conversations}
        activeId={activeConversation?.id ?? null}
        onSelect={selectConversation}
        onNew={newConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
          {activeConversation ? (
            <ModelSelector
              models={models}
              value={activeConversation.model}
              onChange={setActiveModel}
            />
          ) : (
            <span className="text-sm text-[var(--text-muted)]">Loading models...</span>
          )}
          <ThemeToggle />
        </header>

        {modelsError && (
          <div className="border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 text-xs text-[var(--text-secondary)]">
            Couldn&apos;t load the live model list ({modelsError}). Set AGENTROUTER_API_KEY in .env.local.
          </div>
        )}

        <MessageList messages={activeConversation?.messages ?? []} />

        {sendError && (
          <div className="px-4 pb-1 text-xs text-red-500">{sendError}</div>
        )}

        <ChatInput
          onSend={sendMessage}
          disabled={sending || !activeConversation}
          placeholder={
            activeConversation ? `Message ${activeConversation.model}` : "Message..."
          }
        />
      </div>
    </div>
  );
}
