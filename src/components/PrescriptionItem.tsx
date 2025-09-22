import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, EyeOff, FileText, User } from "lucide-react";

interface Prescription {
  _id: string;
  patientId: { name: string; email: string };
  symptoms: string;
  botResponse: string;
  status: string;
  prescriptionNotes?: string;
}

export default function PrescriptionItem({
  p,
  onEdit,
}: {
  p: Prescription;
  onEdit: (prescription: Prescription) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const maxLength = 250; // characters before slicing
  const isLong = p.botResponse.length > maxLength;
  const displayText = expanded
    ? p.botResponse
    : p.botResponse.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <p className="text-lg font-semibold text-gray-800">
            Patient: {p.patientId?.name?.split(" ")[0]}
          </p>
        </div>
        <Badge
          variant={p.status === "PENDING" ? "secondary" : "default"}
          className={`capitalize flex items-center gap-1 ${
            p.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {p.status === "PENDING" && (
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
          {p.status.toLowerCase()}
        </Badge>
      </div>

      {/* Symptoms */}
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Symptoms:
        </span>
        <p className="mt-1 pl-6">{p.symptoms}</p>
      </div>

      {/* Bot response with markdown */}
      <div className="text-sm text-gray-700 prose prose-sm max-w-none bg-gray-50 rounded-md p-3">
        <ReactMarkdown>{displayText}</ReactMarkdown>
      </div>

      {/* Toggle button */}
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

      {/* Prescription notes */}
      {p.prescriptionNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-gray-700">
          <span className="font-medium text-gray-800 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Doctor Notes:
          </span>
          <p className="mt-1 pl-6">{p.prescriptionNotes}</p>
        </div>
      )}

      {/* Action button */}
      <button
        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
        onClick={() => onEdit(p)}
      >
        <Edit className="h-4 w-4" />
        {p.prescriptionNotes ? "Edit Notes" : "Add Notes"}
      </button>
    </div>
  );
}
