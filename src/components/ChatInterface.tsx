/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const INITIAL_BOT_PROMPT =
  "Hello! I'm your healthcare assistant. Tell me about your health concern and I'll help you find the right doctor or provide guidance.";

const initialBotMessage: Message = {
  id: uuidv4(),
  text: INITIAL_BOT_PROMPT,
  sender: "BOT",
  timestamp: new Date(),
  botResponse: "",
};

export default function ChatInterface() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]); // start empty, we'll load from init
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Init conversation and load messages in one call
  useEffect(() => {
    const initConversation = async () => {
      // if not signed in, show greeting only
      if (!session?.user?.id) {
        setConversationId(null);
        setMessages([initialBotMessage]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/conversation/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: session.user.id,
            initialMessage: initialBotMessage, // backend guards duplicate greeting
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Init API error:", data.error);
          throw new Error(data.error || "Failed to initialize conversation");
        }

        // store valid Mongo conversation id
        setConversationId(data.conversationId);

        // normalize messages into your frontend Message shape
        const mapped =
          (data.messages || []).map((msg: any) => ({
            id: msg._id || uuidv4(), // react key
            _id: msg._id, // mongo id
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.timestamp,
            doctors: msg.doctors || [],
            appointmentId: msg.appointmentId,
            prescriptionId: msg.prescriptionId,
          })) || [];

        if (mapped.length > 0) {
          setMessages(mapped);
        } else {
          setMessages([initialBotMessage]);
        }
      } catch (err) {
        console.error("Error initializing conversation:", err);
        setError("Failed to initialize conversation.");
        // fallback to greeting so UI doesn't break
        setMessages([initialBotMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    initConversation();
  }, [session?.user?.id]);

  const saveMessage = async (
    conversationIdArg: string,
    sender: "USER" | "BOT",
    text: string
  ): Promise<string | null> => {
    if (!session?.user || !conversationIdArg) {
      console.error("Cannot save message: missing session or conversationId", {
        session: !!session?.user,
        conversationId: conversationIdArg,
      });
      return null;
    }
    try {
      const res = await fetch("/api/conversation/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIdArg,
          sender,
          text,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error saving message:", errorData.error);
        throw new Error(errorData.error || "Failed to save message");
      }

      const data = await res.json();
      console.log("Save message response:", data);
      return data.messageId || null;
    } catch (err) {
      console.error("Error saving message:", err);
      return null;
    }
  };

  const handleMessageUpdate = (updatedMessage: Message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === updatedMessage._id ? { ...msg, ...updatedMessage } : msg
      )
    );
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      sender: "USER",
      timestamp: new Date(),
      botResponse: "",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);

    // Save user message to DB if we have a conversationId and session
    if (session?.user && conversationId) {
      const mongoId = await saveMessage(conversationId, "USER", currentMessage);
      if (mongoId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, _id: mongoId } : m
          )
        );
      } else {
        console.error("Failed to save user message, missing mongoId");
      }
    } else {
      console.warn("Skipping message save: no session or conversationId", {
        session: !!session?.user,
        conversationId,
      });
    }

    // call assistant (keep current behavior)
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

      const data: ApiResponse & {
        conversationId?: string;
        messageId?: string;
      } = await res.json();

      if (!res.ok) {
        console.error("Assistant API error:", data.error);
        throw new Error(data.error || "Something went wrong");
      }

      // if assistant creates/returns a conversationId, keep it
      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
      }

      const botMessage: Message = {
        id: uuidv4(),
        text: data.text,
        sender: "BOT",
        timestamp: new Date(),
        doctors: data.doctors || [],
        botResponse: "",
      };

      setMessages((prev) => [...prev, botMessage]);

      // save bot message too
      if (session?.user && conversationId) {
        const mongoId = await saveMessage(conversationId, "BOT", data.text);
        if (mongoId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessage.id ? { ...m, _id: mongoId } : m
            )
          );
        } else {
          console.error("Failed to save bot message, missing mongoId");
        }
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      setError("Failed to get a response. Please try again.");
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "BOT",
        timestamp: new Date(),
        botResponse: "",
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
    <div className="flex items-center space-x-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-soft">
      <ChatNavbar />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message._id || message.id}
            message={message}
            isAuthenticated={!!session?.user}
            // send empty string if conversationId is null — MessageItem guards actions
            conversationId={session?.user ? conversationId || "" : ""}
            onMessageUpdate={handleMessageUpdate}
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
            placeholder="Describe your symptoms"
            className="flex-1 border-input/50 focus:border-primary/50 focus:ring-primary/20"
            aria-label="Message input"
          />
          <Button
            onClick={handleSendMessage}
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
