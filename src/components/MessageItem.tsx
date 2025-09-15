
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import ReactMarkdown from "react-markdown";
import React from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  doctors?: Doctor[];
}
const MessageItem = React.memo(
  ({
    message,
    isAuthenticated,
  }: {
    message: Message;
    isAuthenticated: boolean;
  })  => {
  return (
  <div className="animate-fade-in">
      <div
        className={`flex ${
          message.sender === "user" ? "justify-end" : "justify-start"
        } mb-2`}
      >
        <div
          className={`max-w-[100%] rounded-2xl px-2 py-3 shadow-chat ${
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
                className="hover:shadow-medium max-w-xl transition-all duration-300 cursor-pointer border border-border/50"
              >
                <CardContent className="px-4 py-2">
                  <div className="flex flex-col md:flex-row items-baseline md:items-center justify-between space-y-3">
                    <div className="flex md:items-center space-x-3 ">
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
                    <div className="flex mx-auto md:mx-0 md:gap-2 md:flex-row flex-col space-y-2">
                          <Button
                            onClick={() =>
                              alert(`Booking appointment with ${doctor.name}`)
                            }
                            variant="default"
                            size="sm"
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

}
MessageItem.displayName = "MessageItem";

export default MessageItem