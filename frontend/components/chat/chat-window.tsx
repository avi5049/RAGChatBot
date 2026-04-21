"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Info } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 rounded-full bg-primary/10 p-4 text-primary">
          <BrainCircuit size={48} />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome to RAG ChatBot
        </h1>
        <p className="max-w-[420px] text-muted-foreground sm:text-lg">
          Upload your documents in the backend and ask me anything. I use hybrid retrieval and re-ranking for accuracy.
        </p>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {["Tell me about this document", "What are the key points?", "Summarize the text", "Is there info about X?"].map((suggestion) => (
            <div 
              key={suggestion}
              className="rounded-lg border bg-card p-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              "{suggestion}"
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-start gap-2 max-w-sm rounded-lg border border-primary/20 bg-primary/5 p-4 text-left text-xs sm:text-sm">
          <Info size={16} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-muted-foreground italic">
            Note: This chatbot is using a professional RAG pipeline (Multi-Query → BM25 + Vector → RRF → Rerank → LLM).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
      <div className="mx-auto max-w-4xl py-4 pb-24">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
