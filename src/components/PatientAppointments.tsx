"use client";
import React, { useState } from "react";
import { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  FileText,
  Stethoscope,
  Eye,
  EyeOff,
  X,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

interface PatientAppointmentsProps {
  appointments: Appointment[];
  loading: boolean;
  cancelling: boolean;
  onCancelAppointment: (id: string) => void;
  refresh: () => void;
}

export default function PatientAppointments({
  appointments,
  loading,
  onCancelAppointment,
  cancelling,
}: PatientAppointmentsProps) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maxLength = 150;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0 max-w-6xl mx-auto">
      {loading ? (
        [1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-4">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Date Skeleton */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-40 ml-6" />
              </div>

              {/* Symptoms Skeleton */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full ml-6" />
              </div>

              {/* Bot Response Skeleton */}
              <div className="space-y-1 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Action Button Skeleton */}
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        ))
      ) : appointments.length === 0 ? (
        <p className="text-center col-span-full ">No appointments yet.</p>
      ) : (
        appointments.map((appt) => {
          const isExpanded = expanded[appt._id] || false;
          const isLong = appt.botResponse.length > maxLength;
          const displayText = isExpanded
            ? appt.botResponse
            : appt.botResponse.slice(0, maxLength) + (isLong ? "..." : "");

          return (
            <Card key={appt._id}>
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 " />
                    <p className="text-lg font-semibold ">
                      Dr. {appt.doctorId?.name?.split(" ")[0]}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appt.status === "PENDING" ? "secondary" : "default"
                    }
                    className={`capitalize flex items-center gap-1 ${
                      appt.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : appt.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : appt.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appt.status === "PENDING" && (
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    )}
                    {appt.status.toLowerCase()}
                  </Badge>
                </div>

                {/* Date */}
                <div className="text-sm ">
                  <span className="font-medium  flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date:
                  </span>
                  <p className="mt-1 pl-6">
                    {format(appt.scheduledAt, "PPPp")}
                  </p>
                </div>

                {/* Symptoms */}
                <div className="text-sm ">
                  <span className="font-medium  flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Symptoms:
                  </span>
                  <p className="mt-1 pl-6">
                    {<ReactMarkdown>{appt.symptoms}</ReactMarkdown>}
                  </p>
                </div>

                {/* Bot Response */}
                <div className="text-sm  prose prose-sm max-w-none bg-muted rounded-md p-3">
                  <span className="font-medium  flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Assistant Response:
                  </span>
                  <ReactMarkdown>{displayText}</ReactMarkdown>
                  {isLong && (
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mt-2 transition-colors"
                      onClick={() => toggleExpanded(appt._id)}
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          See less
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          See more
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Notes */}
                {appt.appointmentNotes && (
                  <div className="text-sm bg-muted border border-blue-200 rounded-md p-3">
                    <span className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Notes:
                    </span>
                    <p className="mt-1 pl-6">{appt.appointmentNotes}</p>
                  </div>
                )}

                {/* Action Button */}
                {appt.status === "PENDING" && (
                  <Button
                    variant="destructive"
                    onClick={() => onCancelAppointment(appt._id)}
                    className="flex items-center gap-2 w-full"
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Cancel Appointment
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
