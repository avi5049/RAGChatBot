"use client";

import { MessageSquare, Plus, Trash2, Code } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    deleteConversation,
    addConversation 
  } = useChatStore();

  return (
    <div className="flex h-full flex-col border-r bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <Button 
          className="w-full justify-start gap-2 shadow-sm" 
          onClick={() => {
            const id = addConversation("New Chat");
            setActiveConversation(id);
          }}
        >
          <Plus size={18} />
          New Chat
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="flex flex-col gap-1">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No conversations yet. Start a new one!
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  activeConversationId === conv.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
                onClick={() => setActiveConversation(conv.id)}
              >
                <MessageSquare size={16} className="mr-2 shrink-0" />
                <span className="truncate pr-8">{conv.title}</span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      
    </div>
  );
}
