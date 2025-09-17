import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation.model";

// ✅ Handle POST /api/conversation/save-message
export async function POST(req: Request) {
  try {
    const { conversationId, sender, text } = await req.json();

    if (!sender || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🚨 If guest (no conversationId), don't save anything in DB
    if (!conversationId) {
      return NextResponse.json({ success: true, conversation: null });
    }

    await connectDB();

    // ✅ Push message into conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: {
            sender,
            text,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
