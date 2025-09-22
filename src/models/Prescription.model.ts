import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPrescription extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  symptoms: string;
  botResponse: string;
  prescriptionNotes?: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
  createdAt?: Date;
  updatedAt?: Date;
}


const PrescriptionSchema: Schema<IPrescription> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
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
  mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
