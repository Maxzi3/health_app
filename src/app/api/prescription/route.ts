/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";
import Conversation from "@/models/Conversation.model";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { patientId, doctorId, conversationId, messageId, botResponse } =
      await req.json();

    if (!patientId || !doctorId || !conversationId || !messageId) {
      return NextResponse.json(
        {
          error:
            "patientId, doctorId, conversationId, and messageId are required",
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

    //  verify doctor
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

    //  check if prescription already linked
    const alreadyLinked = conversation.messages.find(
      (msg: any) => msg._id.toString() === messageId && msg.prescriptionId
    );
    if (alreadyLinked) {
      return NextResponse.json(
        { error: "Prescription already requested for this message" },
        { status: 400 }
      );
    }

    //  create prescription with ORIGINAL user message as symptoms
    const prescription = await Prescription.create({
      patientId,
      doctorId,
      conversationId,
      messageId,
      symptoms: originalUserSymptoms, //  Use original user message
      botResponse: botResponse || conversation.messages[botMessageIndex].text, //  Use bot response
      status: "PENDING",
    });

    //  attach prescription
    const updated = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        "messages._id": messageId,
        "messages.prescriptionId": null,
      },
      { $set: { "messages.$.prescriptionId": prescription._id } },
      { new: true }
    );

    if (!updated) {
      console.error("Failed to link prescription → cleaning up", {
        conversationId,
        messageId,
      });
      await Prescription.deleteOne({ _id: prescription._id });
      return NextResponse.json(
        { error: "Prescription could not be linked to message" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      prescription,
      message: "Prescription request submitted successfully",
      botResponse: conversation.messages[botMessageIndex].text,
      selectedDoctorId: doctorId,
    });
  } catch (err) {
    console.error("Prescription request error:", err);
    return NextResponse.json(
      { error: "Failed to create prescription request" },
      { status: 500 }
    );
  }
}
