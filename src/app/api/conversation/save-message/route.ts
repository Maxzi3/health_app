// Fixed api/conversation/save-message/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation.model";

export async function POST(req: Request) {
  try {
    const { conversationId, sender, text, doctors } = await req.json(); //  Add doctors

    if (!conversationId || !sender || !text) {
      return NextResponse.json(
        { error: "conversationId, sender, and text are required" },
        { status: 400 }
      );
    }

    await connectDB();

    //  Include doctors in message data
    const messageData = {
      sender,
      text,
      timestamp: new Date(),
      ...(doctors && doctors.length > 0 && { doctors }), // Only add if doctors exist
    };

    // Add message to conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: messageData,
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

    // Get the newly added message
    const newMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    return NextResponse.json({
      messageId: newMessage._id?.toString(),
      message: "Message saved successfully",
    });
  } catch (err) {
    console.error("Error saving message:", err);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
