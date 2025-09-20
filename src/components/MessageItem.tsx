"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
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
    onMessageUpdate,
  }: {
    message: Message;
    isAuthenticated: boolean;
    conversationId: string;
    onMessageUpdate: (updatedMessage: Message) => void;
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

    // BOOK APPOINTMENT

    const handleBookAppointment = async (doctor: Doctor) => {
      if (
        !doctor._id ||
        !session?.user?.id ||
        !conversationId ||
        !message._id
      ) {
        console.error("Missing IDs for appointment:", {
          doctorId: doctor._id,
          patientId: session?.user?.id,
          conversationId,
          messageId: message._id,
        });
        toast.error("Missing required IDs for appointment.");
        return;
      }

      const formattedDate = appointmentDate
        ? format(appointmentDate, "yyyy-MM-dd")
        : undefined;

      setLoadingDoctorId(doctor._id);

      try {
        const res = await fetch("/api/appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: doctor._id,
            patientId: session.user.id,
            conversationId,
            messageId: message._id,
            date: formattedDate,
            time: appointmentTime,
            reason: reason, //  User's reason for appointment
            botResponse: message.text, //  Bot response for context
            //  Remove symptoms - let backend find original user message
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Appointment API error:", data.error);
          throw new Error(data.error || "Failed to book appointment");
        }

        toast.success("Appointment Booked!");

        onMessageUpdate({
          ...message,
          appointmentId: data.appointment._id,
          selectedDoctorId: data.selectedDoctorId,
          botResponse: data.botResponse,
        });

        setOpenAppointmentModal(false);
      } catch (error) {
        console.error("Error booking appointment:", error);
        toast.error("Failed to book appointment.");
      } finally {
        setLoadingDoctorId(null);
      }
    };

    // GET PRESCRIPTION
    const handleGetPrescription = async (doctor: Doctor) => {
      if (
        !doctor._id ||
        !session?.user?.id ||
        !conversationId ||
        !message._id
      ) {
        console.error("Missing IDs for prescription:", {
          doctorId: doctor._id,
          patientId: session?.user?.id,
          conversationId,
          messageId: message._id,
        });
        toast.error("Missing required IDs for prescription.");
        return;
      }

      setLoadingDoctorId(doctor._id);

      try {
        const res = await fetch("/api/prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: doctor._id,
            patientId: session.user.id,
            conversationId,
            messageId: message._id,
            botResponse: message.text, //  Bot response for context
            //  Remove symptoms - let backend find original user message
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Prescription API error:", data.error);
          throw new Error(data.error || "Failed to request prescription");
        }

        toast.success("Prescription Requested!");

        onMessageUpdate({
          ...message,
          prescriptionId: data.prescription._id,
          botResponse: data.botResponse,
          selectedDoctorId: data.selectedDoctorId,
        });

        setOpenPrescriptionModal(false);
      } catch (error) {
        console.error("Error requesting prescription:", error);
        toast.error("Failed to request prescription.");
      } finally {
        setLoadingDoctorId(null);
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
        {/* message bubble */}
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
              <div className="text-sm leading-relaxed">
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
        {/* doctor cards */}
        {message.doctors && message.doctors.length > 0 ? (
          message.doctors.map((doctor) => {
            const hasAppointmentWithThisDoctor =
              message.appointmentId && message.selectedDoctorId === doctor._id;
            const hasPrescriptionWithThisDoctor =
              message.prescriptionId && message.selectedDoctorId === doctor._id;
            return (
              <Card
                key={doctor._id}
                className="hover:shadow-medium max-w-xl transition-all duration-300 cursor-pointer border border-border/50 mb-3"
              >
                <CardContent className="px-4 py-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3">
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
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {doctor.experience} years experience.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      {(() => {
                        const isAppointmentDisabled =
                          hasAppointmentWithThisDoctor ||
                          (!!message.appointmentId &&
                            !hasAppointmentWithThisDoctor) ||
                          loadingDoctorId === doctor._id;
                        return (
                          <Button
                            onClick={() => openAppointmentDialog(doctor)}
                            variant="default"
                            size="sm"
                            disabled={isAppointmentDisabled}
                            className="flex-1 md:flex-none p-2 disabled:cursor-none"
                          >
                            {hasAppointmentWithThisDoctor
                              ? "Appointment Booked"
                              : loadingDoctorId === doctor._id
                              ? "Booking..."
                              : "Book Appointment"}
                          </Button>
                        );
                      })()}
                      <Button
                        onClick={() => openPrescriptionDialog(doctor)}
                        variant="outline"
                        size="sm"
                        disabled={
                          hasPrescriptionWithThisDoctor || 
                          (!!message.prescriptionId &&
                            !hasPrescriptionWithThisDoctor) || 
                          loadingDoctorId === doctor._id
                        }
                        className="flex-1 md:flex-none p-2 disabled:cursor-none"
                      >
                        {hasPrescriptionWithThisDoctor
                          ? "Prescription Requested"
                          : loadingDoctorId === doctor._id
                          ? "Requesting..."
                          : "Get Prescription"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : message.sender === "BOT" && message.expectedDoctors ? (
          <div className="p-3 rounded-lg border border-dashed border-border/50 text-muted-foreground text-sm bg-muted/20">
            No relevant doctors found for your symptoms.
          </div>
        ) : null}
        {/* dialogs */}
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
                  loadingDoctorId === selectedDoctor?._id
                }
              >
                {loadingDoctorId === selectedDoctor?._id
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
                  !selectedDoctor || loadingDoctorId === selectedDoctor?._id
                }
              >
                {loadingDoctorId === selectedDoctor?._id
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
