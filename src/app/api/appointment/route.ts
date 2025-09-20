/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment.model";
import Conversation from "@/models/Conversation.model";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const {
      patientId,
      doctorId,
      conversationId,
      messageId,
      botResponse,
      date: appointmentDate,
      time: appointmentTime,
      reason,
    } = await req.json();

    // Basic validation
    if (
      !patientId ||
      !doctorId ||
      !conversationId ||
      !messageId ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return NextResponse.json(
        {
          error:
            "patientId, doctorId, conversationId, messageId, date and time are required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(conversationId) ||
      !mongoose.Types.ObjectId.isValid(messageId)
    ) {
      return NextResponse.json(
        { error: "Invalid ObjectId provided" },
        { status: 400 }
      );
    }

    await connectDB();

    //  Ensure doctor exists and is a DOCTOR
    const doctor = await mongoose
      .model("User")
      .findOne({ _id: doctorId, role: "DOCTOR" });
    if (!doctor) {
      return NextResponse.json(
        { error: `Doctor with ID ${doctorId} not found or not a doctor` },
        { status: 404 }
      );
    }

    //  Get conversation and find the original user message
    const conversation = await Conversation.findOne({
      _id: conversationId,
      "messages._id": messageId,
    });
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation or message not found" },
        { status: 404 }
      );
    }

    //  Find the bot message and get the previous user message
    const botMessageIndex = conversation.messages.findIndex(
      (msg: any) => msg._id.toString() === messageId && msg.sender === "BOT"
    );

    if (botMessageIndex === -1) {
      return NextResponse.json(
        { error: "Bot message not found" },
        { status: 404 }
      );
    }

    //  Find the user message that preceded this bot response
    const userMessage =
      botMessageIndex > 0 ? conversation.messages[botMessageIndex - 1] : null;

    const originalUserSymptoms =
      userMessage && userMessage.sender === "USER"
        ? userMessage.text
        : "No original message found";

    const scheduledAt = new Date(`${appointmentDate}T${appointmentTime}:00`);

    //  Create appointment with original user message + reason
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      conversationId,
      messageId,
      symptoms: `${originalUserSymptoms}\n\nReason: ${reason}`, //  Original + reason
      botResponse: botResponse || conversation.messages[botMessageIndex].text, //  Bot response
      scheduledAt,
      status: "PENDING",
    });

    //  Try to attach appointment to the message
    const updated = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        "messages._id": messageId,
        "messages.appointmentId": null,
      },
      { $set: { "messages.$.appointmentId": appointment._id } },
      { new: true }
    );

    if (!updated) {
      await Appointment.deleteOne({ _id: appointment._id });
      return NextResponse.json(
        { error: "Appointment already booked for this message" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      appointment,
      message: "Appointment booked successfully",
      botResponse: conversation.messages[botMessageIndex].text,
      selectedDoctorId: doctorId,
    });
  } catch (err) {
    console.error("Appointment booking error:", err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
