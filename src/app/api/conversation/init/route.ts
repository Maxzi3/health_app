import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation, { IConversation } from "@/models/Conversation.model";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { patientId } = await req.json();

    // 🚨 If no patientId → guest, don’t store conversation
    if (!patientId) {
      return NextResponse.json({ conversationId: null });
    }

    // ✅ Try to find the latest conversation for this patient
    let conversation: IConversation | null = await Conversation.findOne({
      patientId,
    }).sort({ createdAt: -1 });

    // ✅ If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        patientId,
        messages: [],
      });
    }

    // ✅ Ensure conversationId is a string
    const conversationId = (conversation._id as Types.ObjectId).toString();

    return NextResponse.json({ conversationId });
  } catch (error) {
    console.error("Error in conversation/init:", error);
    return NextResponse.json(
      { error: "Failed to initialize conversation" },
      { status: 500 }
    );
  }
}
