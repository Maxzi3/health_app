import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";
import Conversation from "@/models/Conversation.model";

export async function POST(req: Request) {
  try {
    const { patientId, doctorId, conversationId, symptoms, botResponse } =
      await req.json();

    if (!patientId || !doctorId) {
      return NextResponse.json(
        { error: "Patient ID and Doctor ID are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create prescription with correct field names
    const prescription = await Prescription.create({
      patientId,
      doctorId,
      symptoms: symptoms || "Prescription requested via chat",
      botResponse: botResponse || "Prescription requested via chat assistant",
      status: "PENDING",
    });

    // Link prescription to conversation if provided
    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        prescriptionId: prescription._id,
      });
    }

    return NextResponse.json({
      prescription,
      message: "Prescription request submitted successfully",
    });
  } catch (err) {
    console.error("Prescription request error:", err);
    return NextResponse.json(
      { error: "Failed to create prescription request" },
      { status: 500 }
    );
  }
}

// GET prescriptions for a patient
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

    const prescriptions = await Prescription.find({ patientId })
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 });

    return NextResponse.json({ prescriptions });
  } catch (err) {
    console.error("Get prescriptions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
