export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AskResponse {
  query: string;
  answer: string;
}

export interface BackendStatus {
  online: boolean;
  message: string;
}
