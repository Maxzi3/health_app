import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment.model";
import Conversation from "@/models/Conversation.model";

export async function POST(req: Request) {
  try {
    const {
      patientId,
      doctorId,
      conversationId,
      symptoms,
      botResponse,
      appointmentDate,
      appointmentTime,
      reason,
    } = await req.json();

    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Combine date and time
    const scheduledAt = new Date(`${appointmentDate}T${appointmentTime}`);

    // Create appointment with correct field names matching your schema
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      symptoms: symptoms || reason,
      botResponse: botResponse || "Appointment booked via chat",
      scheduledAt,
      status: "PENDING",
    });

    // Link appointment to conversation if provided
    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        appointmentId: appointment._id,
      });
    }

    return NextResponse.json({
      appointment,
      message: "Appointment booked successfully",
    });
  } catch (err) {
    console.error("Appointment booking error:", err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

// GET appointments for a patient
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name specialty")
      .sort({ scheduledAt: -1 });

    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("Get appointments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
