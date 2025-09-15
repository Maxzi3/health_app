import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment.model";
import Conversation from "@/models/Conversation.model";


export async function POST(req: Request) {
  try {
    const { patientId, doctorId, conversationId, symptoms, botResponse } =
      await req.json();
    await connectDB();

    // Create appointment with fixed date/time (can customize later)
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: new Date(), // fixed or calculate
      symptoms,
      botResponse,
    });

    // Link appointment to conversation
    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        appointmentId: appointment._id,
      });
    }

    return NextResponse.json({ appointment });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
