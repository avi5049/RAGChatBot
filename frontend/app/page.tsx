"use client";

import { MessageSquare, Menu } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/hooks/useChat";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-full">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar (Sheet) */}
        <div className="lg:hidden absolute left-4 top-[10px] z-[60]">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu size={20} />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative h-full bg-background overflow-hidden">
          {/* Subtle background gradient for depth */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.5))] pointer-events-none" />
          
          <ChatWindow messages={messages} />
          
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
