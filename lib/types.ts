export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  /** Model id that produced this message (assistant messages only) */
  model?: string;
  /** True while an assistant message is still streaming in */
  pending?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface ModelOption {
  id: string;
  label: string;
}
