import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  symptoms: string;
  botResponse: string;
  scheduledAt: Date;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  createdAt?: Date;
  updatedAt?: Date;
}

const AppointmentSchema: Schema<IAppointment> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: { type: String, required: true },
    botResponse: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

delete mongoose.models.Appointment;
export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);


// const totalConsultations = await Appointment.countDocuments({ patientId });
