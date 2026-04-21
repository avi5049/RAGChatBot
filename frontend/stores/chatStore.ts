import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, Message } from "@/lib/types";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  
  // Actions
  setActiveConversation: (id: string | null) => void;
  addConversation: (title: string) => string;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, "id" | "createdAt">) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addConversation: (title) => {
        const id = crypto.randomUUID();
        set((state) => ({
          conversations: [
            {
              id,
              title,
              messages: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            ...state.conversations,
          ],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        })),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  updatedAt: Date.now(),
                  messages: [
                    ...c.messages,
                    {
                      ...message,
                      id: crypto.randomUUID(),
                      createdAt: Date.now(),
                    },
                  ],
                }
              : c
          ),
        })),

      updateMessage: (conversationId, messageId, content) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m
                  ),
                }
              : c
          ),
        })),

      clearHistory: () => set({ conversations: [], activeConversationId: null }),
    }),
    {
      name: "rag-chatbot-storage",
    }
  )
);
