"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/app/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollableContainerRef}
      className="h-full"
    >
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full pt-20 text-center text-muted-foreground">
            <Bot className="w-16 h-16 mb-4 text-primary/30" />
            <h2 className="text-2xl font-semibold">Start a conversation</h2>
            <p>Send a message to begin your chat with Gemini.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 animate-in fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "bot" && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
            {message.role === "user" && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 justify-start animate-in fade-in">
            <Avatar className="w-8 h-8 flex-shrink-0">
               <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted space-y-2">
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-4 w-32" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
