"use client";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import React from "react";
import { useSession } from "next-auth/react";
import { Calendar24 } from "@/components/ui/calendar24";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Message, Doctor } from "@/types/chat";
import { format } from "date-fns";

const MessageItem = React.memo(
  ({
    message,
    isAuthenticated,
    conversationId,
  }: {
    message: Message;
    isAuthenticated: boolean;
    conversationId: string;
  }) => {
    const { data: session } = useSession();
    const [loadingDoctorId, setLoadingDoctorId] = useState<
      string | number | null
    >(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
    const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState<Date | undefined>();
    const [appointmentTime, setAppointmentTime] = useState<string>("10:30");
    const [reason, setReason] = useState("");

    const formatTimestamp = (timestamp: Date | string) => {
      try {
        const date =
          timestamp instanceof Date ? timestamp : new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid time";
        return format(date, "h:mm a");
      } catch {
        return "Invalid time";
      }
    };

    const handleBookAppointment = async (doctor: Doctor) => {
      if (
        !session?.user?.id ||
        !conversationId ||
        !appointmentDate ||
        !appointmentTime ||
        !reason.trim()
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      setLoadingDoctorId(doctor.id);
      try {
        const res = await fetch("/api/appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: session.user.id,
            doctorId: doctor.id,
            conversationId,
            symptoms: message.sender === "USER" ? message.text : "",
            botResponse: message.sender === "BOT" ? message.text : "",
            appointmentDate: appointmentDate.toISOString().split("T")[0],
            appointmentTime: `${appointmentTime}:00`,
            reason,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Appointment Booked!");
          setAppointmentDate(undefined);
          setAppointmentTime("10:30");
          setReason("");
        } else {
          throw new Error(data.error || "Failed to book appointment");
        }
      } catch (err) {
        console.error("Appointment booking error:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to book appointment"
        );
      } finally {
        setLoadingDoctorId(null);
        setOpenAppointmentModal(false);
        setSelectedDoctor(null);
      }
    };

    const handleGetPrescription = async (doctor: Doctor) => {
      if (!session?.user?.id || !conversationId) {
        toast.error("Please log in to request a prescription");
        return;
      }
      setLoadingDoctorId(doctor.id);
      try {
        const res = await fetch("/api/prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: session.user.id,
            doctorId: String(doctor.id), // Ensure string
            conversationId,
            symptoms: message.sender === "USER" ? message.text : "",
            botResponse: message.sender === "BOT" ? message.text : "",
          }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Prescription Requested!");
        } else {
          throw new Error(data.error || "Failed to request prescription");
        }
      } catch (err) {
        console.error("Prescription request error:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to request prescription"
        );
      } finally {
        setLoadingDoctorId(null);
        setOpenPrescriptionModal(false);
        setSelectedDoctor(null);
      }
    };

    const openAppointmentDialog = (doctor: Doctor) => {
      setSelectedDoctor(doctor);
      setOpenAppointmentModal(true);
    };

    const openPrescriptionDialog = (doctor: Doctor) => {
      setSelectedDoctor(doctor);
      setOpenPrescriptionModal(true);
    };

    return (
      <div className="animate-fade-in">
        <div
          className={`flex ${
            message.sender === "USER" ? "justify-end" : "justify-start"
          } mb-2`}
        >
          <div
            className={`max-w-[100%] rounded-2xl px-4 py-3 shadow-chat ${
              message.sender === "USER"
                ? "chat-message-user ml-12"
                : "chat-message-bot mr-12"
            }`}
          >
            {message.sender === "BOT" ? (
              <div className="prose prose-sm text-sm leading-relaxed">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{message.text}</p>
            )}
            <p
              className={`text-xs mt-2 ${
                message.sender === "USER"
                  ? "text-gray-600"
                  : "text-muted-foreground"
              }`}
            >
              {formatTimestamp(message.timestamp)}
            </p>
          </div>
        </div>
        {isAuthenticated && message.doctors !== undefined && (
          <div className="mr-12 mt-3 animate-scale-in space-y-3">
            {message.doctors && message.doctors.length > 0 ? (
              message.doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="hover:shadow-medium max-w-xl transition-all duration-300 cursor-pointer border border-border/50"
                >
                  <CardContent className="px-4 py-3">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
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
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button
                          onClick={() => openAppointmentDialog(doctor)}
                          variant="default"
                          size="sm"
                          disabled={loadingDoctorId === doctor.id}
                          className="flex-1 md:flex-none"
                        >
                          {loadingDoctorId === doctor.id
                            ? "Booking..."
                            : "Book Appointment"}
                        </Button>
                        <Button
                          onClick={() => openPrescriptionDialog(doctor)}
                          variant="outline"
                          size="sm"
                          disabled={loadingDoctorId === doctor.id}
                          className="flex-1 md:flex-none"
                        >
                          {loadingDoctorId === doctor.id
                            ? "Requesting..."
                            : "Get Prescription"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : message.sender === "BOT" ? (
              <div className="p-3 rounded-lg border border-dashed border-border/50 text-muted-foreground text-sm bg-muted/20">
                No relevant doctors found for your symptoms.
              </div>
            ) : null}
          </div>
        )}
        <Dialog
          open={openAppointmentModal}
          onOpenChange={setOpenAppointmentModal}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Book Appointment with {selectedDoctor?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Calendar24
                date={appointmentDate}
                setDate={setAppointmentDate}
                time={appointmentTime}
                setTime={setAppointmentTime}
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor="reason">Reason for Appointment *</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenAppointmentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedDoctor && handleBookAppointment(selectedDoctor)
                }
                disabled={
                  !appointmentDate ||
                  !appointmentTime ||
                  !reason.trim() ||
                  !selectedDoctor ||
                  loadingDoctorId === selectedDoctor?.id
                }
              >
                {loadingDoctorId === selectedDoctor?.id
                  ? "Booking..."
                  : "Confirm Appointment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openPrescriptionModal}
          onOpenChange={setOpenPrescriptionModal}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Request Prescription from {selectedDoctor?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This will send your symptoms and chat conversation to the doctor
                for review. They will provide a prescription if medically
                appropriate.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenPrescriptionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedDoctor && handleGetPrescription(selectedDoctor)
                }
                disabled={
                  !selectedDoctor || loadingDoctorId === selectedDoctor?.id
                }
              >
                {loadingDoctorId === selectedDoctor?.id
                  ? "Requesting..."
                  : "Confirm Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";
export default MessageItem;
