"use client";
import { useState, ReactNode } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ChatNavbar from "./ChatNavbar";
import ReactMarkdown from "react-markdown";
import React from "react";
import { useSession } from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();
  return {
    isAuthenticated: !!session,
    user: session?.user || null,
    status,
  };
};

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  doctors?: Doctor[];
}

interface ApiResponse {
  text: string;
  doctors?: Doctor[];
  error?: string;
}

const MessageItem = React.memo(
  ({
    message,
    isAuthenticated,
  }: {
    message: Message;
    isAuthenticated: boolean;
  }) => (
    <div className="animate-fade-in">
      <div
        className={`flex ${
          message.sender === "user" ? "justify-end" : "justify-start"
        } mb-2`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-chat ${
            message.sender === "user"
              ? "chat-message-user ml-12"
              : "chat-message-bot mr-12"
          }`}
        >
          {message.sender === "bot" ? (
            <div className="prose prose-sm text-sm leading-relaxed">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.text}</p>
          )}

          <p
            className={`text-xs mt-2 ${
              message.sender === "user"
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Doctor recommendations */}
      {isAuthenticated && message.doctors !== undefined && (
        <div className="mr-12 mt-3 animate-scale-in space-y-3">
          {message.doctors && message.doctors.length > 0 ? (
            message.doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="hover:shadow-medium transition-all duration-300 cursor-pointer border border-border/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="bg-gradient-success">
                        <AvatarFallback className="text-accent-foreground font-medium">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            ⭐ {doctor.rating}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {doctor.experience} exp.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() =>
                          alert(`Booking appointment with ${doctor.name}`)
                        }
                        variant="default"
                        size="sm"
                        className="bg-gradient-primary"
                        aria-label={`Book appointment with ${doctor.name}`}
                      >
                        Book Appointment
                      </Button>
                      <Button
                        onClick={() =>
                          alert(`Requesting prescription from ${doctor.name}`)
                        }
                        variant="outline"
                        size="sm"
                        aria-label={`Get prescription from ${doctor.name}`}
                      >
                        Get Prescription
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : message.sender === "bot" ? (
            // ✅ Fallback message if no doctors
            <div className="p-3 rounded-lg border border-dashed border-border/50 text-muted-foreground text-sm bg-muted/20">
              No relevant doctors found for your symptoms.
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
);

MessageItem.displayName = "MessageItem";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your healthcare assistant. Tell me about your health concern and I'll help you find the right doctor or provide guidance.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          isAuthenticated,
        }),
      });

      if (!res.ok) {
        const apiError: ApiResponse = await res.json();
        throw new Error(apiError.error || "API request failed");
      }

      const data: ApiResponse = await res.json();

      const botResponse: Message = {
        id: messages.length + 2,
        text: data.text,
        sender: "bot",
        timestamp: new Date(),
        doctors: data.doctors || [],
      };

      setMessages((prev) => [...prev, botResponse]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError("Failed to get a response. Please try again.");
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
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
    <div className="flex justify-start animate-fade-in">
      <div className="chat-message-bot mr-12">
        <Skeleton className="h-12 w-[60%] mb-2" />
        <Skeleton className="h-4 w-20" />
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
            isAuthenticated={isAuthenticated}
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
