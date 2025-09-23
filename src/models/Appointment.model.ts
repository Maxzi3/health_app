import { Appointment } from "@/types/appointment";
import mongoose, { Schema } from "mongoose";

const AppointmentSchema: Schema<Appointment> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: { type: String, required: true },
    botResponse: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    appointmentNotes: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

delete mongoose.models.Appointment;
export default mongoose.model<Appointment>("Appointment", AppointmentSchema);
