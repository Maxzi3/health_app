"use client";
import { useState } from "react";
import { Calendar, Eye, EyeOff, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AppointmentItem({
  a,
  refresh,
  loading = false,
}: {
  a: Appointment;
  refresh: () => void;
  loading?: boolean;
}) {
  const [updating, setUpdating] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState(
    a.appointmentNotes || ""
  );
  const [expanded, setExpanded] = useState(false);

  const updateStatus = async (status: Appointment["status"]) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/appointment/${a._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, appointmentNotes }),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      toast.success(`Status changed to ${status}`);
      refresh();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update appointment");
    } finally {
      setUpdating(false);
    }
  };

  const maxLength = 250;
  const isLong = (a.botResponse ?? "").length > maxLength;
  const displayText = expanded
    ? a.botResponse
    : (a.botResponse ?? "").slice(0, maxLength) + (isLong ? "..." : "");

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full ml-6" />
        </div>
        <div className="space-y-1 bg-gray-50 rounded-md p-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-5 w-24" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-40 ml-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-16 w-full ml-6" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <p className="text-lg font-semibold text-gray-800">
            Patient: {a.patientId?.name?.split(" ")[0]}
          </p>
        </div>
        <Badge
          variant={a.status === "PENDING" ? "secondary" : "default"}
          className={`capitalize flex items-center gap-1 ${
            a.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : a.status === "CONFIRMED"
              ? "bg-blue-100 text-blue-800"
              : a.status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {a.status === "PENDING" && (
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
          {a.status.toLowerCase()}
        </Badge>
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Symptoms:
        </span>
        <p className="mt-1 pl-6">{a.symptoms}</p>
      </div>
      <div className="text-sm text-gray-700 prose prose-sm max-w-none bg-gray-50 rounded-md p-3">
        <ReactMarkdown>{displayText}</ReactMarkdown>
      </div>
      {isLong && (
        <button
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
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
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date:
        </span>
        <p className="mt-1 pl-6">{format(a.scheduledAt, "PPPp")}</p>
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes:
        </span>
        <textarea
          value={appointmentNotes}
          onChange={(e) => setAppointmentNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full mt-1 pl-6 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {["CONFIRMED", "COMPLETED", "CANCELLED"]
          .filter(
            (status) =>
              a.status === status ||
              (a.status !== "COMPLETED" && a.status !== "CANCELLED")
          )
          .map((status) => (
            <button
              key={status}
              disabled={
                updating ||
                a.status === status ||
                a.status === "COMPLETED" ||
                a.status === "CANCELLED"
              }
              onClick={() => updateStatus(status as Appointment["status"])}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                a.status === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } ${
                updating || a.status === "COMPLETED" || a.status === "CANCELLED"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {status}
            </button>
          ))}
      </div>
    </div>
  );
}
