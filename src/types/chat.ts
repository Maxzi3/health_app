import { Document, Types } from "mongoose";

export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
}

export interface Message {
  id: string;
  _id?: string;
  sender: "USER" | "BOT";
  text: string;
  timestamp: string | Date;
  doctors?: Doctor[];
  appointmentId?: string;
  prescriptionId?: string;
  expectedDoctors?: boolean;
  selectedDoctorId?: string;
  botResponse: string;
}

// MongoDB Document interfaces (for Mongoose operations)
export interface IMessage {
  _id?: Types.ObjectId; // Make optional since it's auto-generated
  sender: "USER" | "BOT";
  text: string;
  timestamp: Date;
  replyTo?: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  prescriptionId?: Types.ObjectId;
  doctors?: Doctor[]; // Add doctors array
}

export interface IConversation extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response interfaces (for frontend)
export interface MessageResponse {
  _id: string;
  sender: "USER" | "BOT";
  text: string;
  timestamp: string;
  appointmentId?: string;
  prescriptionId?: string;
}

export interface ConversationResponse {
  _id: string;
  patientId: string;
  messages: MessageResponse[];
  createdAt?: string;
  updatedAt?: string;
}
