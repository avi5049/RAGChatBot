"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Cpu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export function Header() {
  const { setTheme } = useTheme();
  const [status, setStatus] = useState<{ online: boolean; message: string }>({
    online: false,
    message: "Checking...",
  });

  useEffect(() => {
    const checkBackend = async () => {
      const res = await api.checkStatus();
      setStatus(res);
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <div className="rounded-lg bg-primary p-1 text-primary-foreground">
            <Cpu size={20} />
          </div>
          <span className="hidden sm:inline-block">RAG ChatBot</span>
        </div>

        <div className="flex items-center gap-4">
          <Badge 
            variant={status.online ? "default" : "destructive"} 
            className="hidden md:flex gap-1 items-center"
          >
            <span className={`h-2 w-2 rounded-full ${status.online ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
            {status.online ? "Backend Online" : "Backend Offline"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
