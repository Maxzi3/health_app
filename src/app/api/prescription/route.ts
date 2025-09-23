/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";
import Conversation from "@/models/Conversation.model";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

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
    const doctor = await User.findOne({ _id: doctorId, role: "DOCTOR" });
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

    //  Find the bot message
    const botMessageIndex = conversation.messages.findIndex(
      (msg: any) => msg._id.toString() === messageId && msg.sender === "BOT"
    );

    if (botMessageIndex === -1) {
      return NextResponse.json(
        { error: "Bot message not found" },
        { status: 404 }
      );
    }

    //  Walk backwards to find the last USER message before the bot
    let userMessage: any = null;
    for (let i = botMessageIndex - 1; i >= 0; i--) {
      if (conversation.messages[i].sender === "USER") {
        userMessage = conversation.messages[i];
        break;
      }
    }

    const originalUserSymptoms = userMessage
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

    // create prescription
    const prescription = await Prescription.create({
      patientId,
      doctorId,
      conversationId,
      messageId,
      symptoms: originalUserSymptoms, // use original user message
      botResponse: botResponse || conversation.messages[botMessageIndex].text,
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let prescriptions;

    if (user.role === "DOCTOR") {
      prescriptions = await Prescription.find({
        doctorId: user._id,
      }).populate("patientId", "name email");
    } else if (user.role === "PATIENT") {
      prescriptions = await Prescription.find({
        patientId: user._id,
      }).populate("doctorId", "name email");
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(prescriptions);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
