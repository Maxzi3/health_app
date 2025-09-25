/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment.model";
import Conversation from "@/models/Conversation.model";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


export async function POST(req: Request) {
  try {
    const {
      patientId,
      doctorId,
      conversationId,
      messageId,
      botResponse,
      date: appointmentDate, // ISO string
      time: appointmentTime, // "HH:mm"
      reason,
    } = await req.json();

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

    // ✅ Ensure doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: "DOCTOR" });
    if (!doctor) {
      return NextResponse.json(
        { error: `Doctor with ID ${doctorId} not found or not a doctor` },
        { status: 404 }
      );
    }

    // ✅ Find conversation
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

    // ✅ Locate bot message
    const botMessageIndex = conversation.messages.findIndex(
      (msg: any) => msg._id.toString() === messageId && msg.sender === "BOT"
    );

    if (botMessageIndex === -1) {
      return NextResponse.json(
        { error: "Bot message not found" },
        { status: 404 }
      );
    }

    // ✅ Walk backwards to find the last USER message
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

    // ✅ Parse appointment date & time
    let scheduledAt: Date;
    try {
      const d = new Date(appointmentDate);
      if (isNaN(d.getTime())) throw new Error("Invalid date");

      const [hours, minutes] = appointmentTime.split(":").map(Number);
      scheduledAt = new Date(d);
      scheduledAt.setHours(hours, minutes, 0, 0);

      if (isNaN(scheduledAt.getTime())) throw new Error("Invalid date or time");
    } catch  {
      return NextResponse.json(
        {
          error:
            "Invalid date or time format. Send date as ISO string and time as HH:mm",
        },
        { status: 400 }
      );
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      conversationId,
      messageId,
      symptoms: `${originalUserSymptoms}\n\nReason: ${reason}`,
      botResponse: botResponse || conversation.messages[botMessageIndex].text,
      scheduledAt,
      status: "PENDING",
    });

    // ✅ Attach to conversation
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

    let appointments;

    if (user.role === "DOCTOR") {
      // Doctor → fetch patients' appointments
      appointments = await Appointment.find({
        doctorId: user._id,
      }).populate("patientId", "name email");
    } else if (user.role === "PATIENT") {
      // Patient → fetch their own appointments
      appointments = await Appointment.find({
        patientId: user._id,
      }).populate("doctorId", "name email");
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
