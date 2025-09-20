import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation.model";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Fetching conversation with ID:", id);

    if (!id) {
      console.error("No conversation ID provided");
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    //  Use mongoose.Types.ObjectId.isValid() for proper validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ObjectId format:", id);
      return NextResponse.json(
        { error: "Invalid conversation ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Transform messages to ensure _id is included as string
    const messages = conversation.messages.map((msg) => ({
      _id: msg._id?.toString(),
      sender: msg.sender,
      text: msg.text,
      timestamp: msg.timestamp,
      appointmentId: msg.appointmentId?.toString(),
      prescriptionId: msg.prescriptionId?.toString(),
      doctors: msg.doctors || [], // Include doctors array
    }));

    return NextResponse.json({
      _id: conversation._id.toString(),
      patientId: conversation.patientId.toString(),
      messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching conversation:", err);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
