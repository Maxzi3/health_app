"use client";
import React, { useState } from "react";
import { Prescription } from "@/types/prescription";
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
  CheckCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PatientPrescriptionsProps {
  prescriptions: Prescription[];
  loading: boolean;
  onMarkCompleted: (id: string) => void;
  refresh: () => void;
}

export default function PatientPrescriptions({
  prescriptions,
  loading,
  onMarkCompleted,
}: PatientPrescriptionsProps) {
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
              <div className="space-y-1  rounded-md p-3">
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
      ) : prescriptions.length === 0 ? (
        <p className="text-center col-span-full ">No prescriptions yet.</p>
      ) : (
        prescriptions.map((pres) => {
          const isExpanded = expanded[pres._id] || false;
          const isLong = pres.botResponse.length > maxLength;
          const displayText = isExpanded
            ? pres.botResponse
            : pres.botResponse.slice(0, maxLength) + (isLong ? "..." : "");

          return (
            <Card key={pres._id}>
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5" />
                    <p className="text-lg font-semibold">
                      Dr. {pres.doctorId?.name}
                    </p>
                  </div>
                  <Badge
                    variant={
                      pres.status === "PENDING" ? "secondary" : "default"
                    }
                    className={`capitalize flex items-center gap-1 ${
                      pres.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : pres.status === "ACTIVE"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pres.status.toLowerCase()}
                  </Badge>
                </div>

                {/* Date */}
                <div className="text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Issued:
                  </span>
                  <p className="mt-1 pl-6">
                    {new Date(pres.createdAt ?? "").toLocaleString()}
                  </p>
                </div>

                {/* Symptoms */}
                <div className="text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Symptoms:
                  </span>
                  <p className="mt-1 pl-6">{pres.symptoms}</p>
                </div>

                {/* Bot Response */}
                <div className="text-sm  prose prose-sm max-w-none bg-muted rounded-md p-3">
                  <span className="font-medium flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    Assistant Analysis:
                  </span>
                  <ReactMarkdown>{displayText}</ReactMarkdown>
                  {isLong && (
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mt-2 transition-colors"
                      onClick={() => toggleExpanded(pres._id)}
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

                {/* Prescription Notes */}
                {pres.prescriptionNotes && (
                  <div className="text-sm bg-muted border border-blue-200 rounded-md p-3">
                    <span className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Doctor Notes:
                    </span>
                    <p className="mt-1 pl-6">{pres.prescriptionNotes}</p>
                  </div>
                )}

                {/* Action Button */}
                {pres.status === "ACTIVE" && (
                  <Button
                    onClick={() => onMarkCompleted(pres._id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Completed
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
