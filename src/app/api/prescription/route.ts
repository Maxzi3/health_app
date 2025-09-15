import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";
import Conversation from "@/models/Conversation.model";

export async function POST(req: Request) {
  try {
    const { patientId, doctorId, conversationId, symptoms, botResponse } =
      await req.json();
    await connectDB();

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      botResponse,
    });

    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        prescriptionId: prescription._id,
      });
    }

    return NextResponse.json({ prescription });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create prescription" },
      { status: 500 }
    );
  }
}
