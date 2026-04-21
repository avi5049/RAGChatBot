"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { User, Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";

import "highlight.js/styles/github-dark.css";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-4 py-8 px-4 sm:px-6 transition-colors",
        isAssistant ? "bg-muted/50" : "bg-background"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isAssistant ? "bg-primary text-primary-foreground" : "bg-background"
        )}
      >
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>

      <div className="relative flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose dark:prose-invert max-w-none break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ node, ...props }) => (
                <div className="overflow-auto my-2 w-full rounded-lg bg-zinc-950 p-4">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, className, children, ...props }) => (
                <code
                  className={cn(
                    "rounded bg-zinc-800 px-1 py-0.5 font-mono text-sm",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
          {isAssistant && message.content === "" && (
            <span className="inline-block h-4 w-1 animate-pulse bg-primary" />
          )}
        </div>

        {isAssistant && message.content && (
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyToClipboard}
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
