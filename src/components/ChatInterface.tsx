"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ChatNavbar from "./ChatNavbar";
import MessageItem from "./MessageItem";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { Message, Doctor } from "@/types/chat";

interface ApiResponse {
  text: string;
  doctors?: Doctor[];
  error?: string;
}
const initialBotMessage: Message = {
  id: uuidv4(),
  text: "Hello! I'm your healthcare assistant. Tell me about your health concern and I'll help you find the right doctor or provide guidance.",
  sender: "BOT",
  timestamp: new Date(),
};
export default function ChatInterface() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "authenticated" || !conversationId) return;
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/conversation/${conversationId}`);
        if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
        const data = await res.json();
        // Always include the initial bot message, followed by fetched messages
        if (data.messages?.length > 0) {
          // Avoid duplicating initial message if it exists in fetched messages
          const hasInitialMessage = data.messages.some(
            (msg: Message) =>
              msg.text === initialBotMessage.text && msg.sender === "BOT"
          );
          setMessages(
            hasInitialMessage
              ? data.messages
              : [initialBotMessage, ...data.messages]
          );
        } else {
          setMessages([initialBotMessage]); // Keep initial message if no messages fetched
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setError("Failed to load chat history.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [conversationId, status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initConversation = async () => {
      if (session?.user?.id) {
        const res = await fetch("/api/conversation/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId: session.user.id }),
        });
        const data = await res.json();
        setConversationId(data.conversationId);
      } else {
        setConversationId(null);
      }
    };
    initConversation();
  }, [session?.user?.id]);

  const saveMessage = async (
    conversationId: string,
    sender: "USER" | "BOT",
    text: string
  ) => {
    if (!session?.user) return;
    try {
      await fetch("/api/conversation/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, sender, text }),
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      sender: "USER",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);

    if (session?.user && conversationId) {
      await saveMessage(conversationId, "USER", currentMessage);
    }

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          conversationId: session?.user ? conversationId : null,
          patientId: session?.user?.id || null,
          isAuthenticated: !!session?.user,
        }),
      });

      const data: ApiResponse & { conversationId?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
      }

      const botMessage: Message = {
        id: uuidv4(),
        text: data.text,
        sender: "BOT",
        timestamp: new Date(),
        doctors: data.doctors || [],
      };

      setMessages((prev) => [...prev, botMessage]);

      if (session?.user && conversationId) {
        await saveMessage(conversationId, "BOT", data.text);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get a response. Please try again.");
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "BOT",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

 const LoadingSkeleton: ReactNode = (
   <div className="flex justify-start animate-pulse mb-4">
     <div className="bg-gray-200 rounded-2xl px-4 py-3 w-[60%] mr-12 shadow-sm">
       <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
       <div className="h-4 bg-gray-300 rounded w-1/4"></div>
     </div>
   </div>
 );

  return (
    <div className="h-screen flex flex-col bg-gradient-soft">
      <ChatNavbar />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isAuthenticated={!!session?.user}
            conversationId={session?.user ? conversationId || "" : ""}
          />
        ))}
        {isLoading && LoadingSkeleton}
        {error && (
          <div className="flex justify-center">
            <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg max-w-[80%] text-center">
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-card">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label="Emoji picker"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms or health concern..."
            className="flex-1 border-input/50 focus:border-primary/50 focus:ring-primary/20"
            aria-label="Message input"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-primary shadow-soft hover:shadow-medium transition-all duration-300"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
