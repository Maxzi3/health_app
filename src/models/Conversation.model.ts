import mongoose, { Schema } from "mongoose";
import { IMessage, IConversation } from "@/types/chat";

const MessageSchema: Schema<IMessage> = new Schema(
  {
    sender: { type: String, enum: ["USER", "BOT"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replyTo: { type: Schema.Types.ObjectId },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: null, //
    },
    prescriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
  },
  { _id: true }
);

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [MessageSchema],
    dailyMessageCount: {
      type: Number,
      default: 0,
    },
    lastMessageDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Clean up existing model to avoid recompilation issues
delete mongoose.models.Conversation;

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
