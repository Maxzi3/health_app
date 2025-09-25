/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation.model";
import mongoose from "mongoose";

export async function GET(req: Request, context: any) {
  try {
    const { conversationId } = (
      context as { params: { conversationId: string } }
    ).params;
    console.log("Fetching conversation with ID:", conversationId);

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = conversation.messages.map((msg) => ({
      _id: msg._id?.toString(),
      sender: msg.sender,
      text: msg.text,
      timestamp: msg.timestamp,
      appointmentId: msg.appointmentId?.toString(),
      prescriptionId: msg.prescriptionId?.toString(),
      doctors: msg.doctors || [],
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
