import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage {
  sender: "USER" | "BOT";
  text: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  patientId: Types.ObjectId;
  messages: IMessage[];
  appointmentId?: Types.ObjectId;
  prescriptionId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    sender: { type: String, enum: ["USER", "BOT"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // Don't create separate _id for each message
);

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [MessageSchema],
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription" },
  },
  { timestamps: true }
);

delete mongoose.models.Conversation;
export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);



// 2️⃣ Integration with your chat flow

// On sending a message:

// Append to a Conversation document:

// await Conversation.findByIdAndUpdate(conversationId, {
//   $push: { messages: { sender: "USER", text: inputValue, timestamp: new Date() } }
// });


// On receiving a bot reply:

// Append bot message to the same conversation:

// await Conversation.findByIdAndUpdate(conversationId, {
//   $push: { messages: { sender: "BOT", text: botResponse, timestamp: new Date() } }
// });


// Link conversation to Appointment / Prescription:

// When user books an appointment or requests a prescription, you can save:

// conversation.appointmentId = appointment._id;
// conversation.prescriptionId = prescription._id;
// await conversation.save();


// Doctor dashboard:

// Load conversation along with Appointment / Prescription to see context:

// const appointment = await Appointment.findById(appointmentId).populate('patientId');
// const conversation = await Conversation.findOne({ appointmentId });