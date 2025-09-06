"use client";
import { useState } from "react";
import { Send, Smile} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "./Logo";
import ChatNavbar from "./ChatNavbar";

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

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Jane Doe",
    specialty: "Neurologist",
    rating: 4.9,
    experience: "8 years",
  },
  {
    id: 2,
    name: "Dr. Smith John",
    specialty: "General Practitioner",
    rating: 4.7,
    experience: "12 years",
  },
  {
    id: 3,
    name: "Dr. Rose Lee",
    specialty: "Psychologist",
    rating: 4.8,
    experience: "6 years",
  },
];

interface ChatInterfaceProps {
  onOpenDashboard: () => void;
}

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    // Simulate bot response with doctor recommendations
    const botResponse: Message = {
      id: messages.length + 2,
      text: `I understand you're experiencing ${inputValue.toLowerCase()}. Based on your symptoms, I recommend consulting with these specialists:`,
      sender: "bot",
      timestamp: new Date(),
      doctors: mockDoctors,
    };

    setMessages([...messages, userMessage, botResponse]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-soft">
      {/* Header */}
      <ChatNavbar />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="animate-fade-in">
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
                <p className="text-sm leading-relaxed">{message.text}</p>
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
            {message.doctors && (
              <div className="mr-12 space-y-3 mt-3 animate-scale-in">
                {message.doctors.map((doctor) => (
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
                            variant="default"
                            size="sm"
                            className="bg-gradient-primary"
                          >
                            Book Appointment
                          </Button>
                          <Button variant="outline" size="sm">
                            Get Prescription
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms or health concern..."
            className="flex-1 border-input/50 focus:border-primary/50 focus:ring-primary/20"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-primary shadow-soft hover:shadow-medium transition-all duration-300"
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
