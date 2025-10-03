"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendMessage, type ChatMessage } from "@/app/actions";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { Bot } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (input: string) => {
    if (isLoading || !input.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const response = await sendMessage(input);

    if (response.role === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.text,
      });
      // Revert adding the user message if there was an error
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } else {
      setMessages((prev) => [...prev, response]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-center gap-2 p-4 border-b shadow-sm">
        <Bot className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">
          Gemini Chat
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <footer className="p-4 bg-background/95 backdrop-blur-sm border-t">
        <div className="max-w-2xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}
