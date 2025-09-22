"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PrescriptionModal({
  prescriptionId,
  onSaved,
}: {
  prescriptionId: string;
  onSaved: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptionNotes: notes }),
      });
      onSaved();
    } catch (err) {
      console.error("Error saving prescription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onSaved}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write Prescription</DialogTitle>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter prescription notes..."
          className="min-h-[100px]"
        />
        <Button onClick={handleSave} disabled={loading} className="mt-4">
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
