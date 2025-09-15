import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPrescription extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  symptoms: string;
  botResponse: string;
  prescriptionText?: string; // Doctor adds prescription here
  status: "PENDING" | "SENT" | "COMPLETED";
  createdAt?: Date;
  updatedAt?: Date;
}

const PrescriptionSchema: Schema<IPrescription> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: { type: String, required: true },
    botResponse: { type: String, required: true },
    prescriptionText: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

delete mongoose.models.Prescription;
export default mongoose.model<IPrescription>(
  "Prescription",
  PrescriptionSchema
);
