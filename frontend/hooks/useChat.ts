import { useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { api } from "@/lib/api";

export const useChat = () => {
  const { 
    activeConversationId, 
    addConversation, 
    addMessage, 
    updateMessage,
    conversations 
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    let currentConversationId = activeConversationId;

    // Create new conversation if none active
    if (!currentConversationId) {
      currentConversationId = addConversation(content.slice(0, 30) + "...");
    }

    // Add user message
    addMessage(currentConversationId, {
      role: "user",
      content,
    });

    setIsLoading(true);

    try {
      // Add empty assistant message for streaming
      const assistantMessageId = crypto.randomUUID();
      // Temporarily adding assistant message manually to use its ID for updates
      // Note: addMessage in store generates its own ID, so I'll refactor store slightly 
      // or just handle streaming state here.
      // Better: Add assistant message then update it.
      
      const assistantId = addAssistantPlaceholder(currentConversationId);
      let fullContent = "";

      await api.askStream(content, (token) => {
        fullContent += token;
        updateMessage(currentConversationId!, assistantId, fullContent);
      });

    } catch (error) {
      console.error("Chat error:", error);
      // Fallback or error message
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to add placeholder and return its ID
  const addAssistantPlaceholder = (convId: string) => {
    const id = crypto.randomUUID();
    const { conversations } = useChatStore.getState();
    const conv = conversations.find(c => c.id === convId);
    
    // We update store directly for the immediate feedback
    useChatStore.setState((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id, role: "assistant", content: "", createdAt: Date.now() }
              ]
            }
          : c
      )
    }));
    
    return id;
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return {
    sendMessage,
    isLoading,
    messages: activeConversation?.messages || [],
    activeConversationId
  };
};
