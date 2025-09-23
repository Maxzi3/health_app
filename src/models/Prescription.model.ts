import mongoose, { Schema } from "mongoose";
import { Prescription as PrescriptionType } from "@/types/prescription";

const PrescriptionSchema: Schema<PrescriptionType> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messageId: { type: Schema.Types.ObjectId, required: true },
    symptoms: { type: String, required: true },
    botResponse: { type: String, required: true },
    prescriptionNotes: { type: String },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription ||
  mongoose.model<PrescriptionType>("Prescription", PrescriptionSchema);
