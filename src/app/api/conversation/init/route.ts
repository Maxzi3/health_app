// api/conversation/init/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation.model";

export async function POST(req: Request) {
  try {
    const { patientId, initialMessage } = await req.json();

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔎 Look for existing conversation
    let conversation = await Conversation.findOne({ patientId });

    if (!conversation) {
      // 🆕 Create new conversation
      const conversationData = {
        patientId,
        messages: initialMessage
          ? [
              {
                sender: initialMessage.sender,
                text: initialMessage.text,
                timestamp: new Date(initialMessage.timestamp),
              },
            ]
          : [],
      };

      conversation = await Conversation.create(conversationData);
    } else if (initialMessage) {
      //  Only add greeting if it's not already in messages
      const alreadyHasGreeting = conversation.messages.some(
        (msg) => msg.sender === "BOT" && msg.text === initialMessage.text
      );

      if (!alreadyHasGreeting) {
        conversation.messages.push({
          sender: initialMessage.sender,
          text: initialMessage.text,
          timestamp: new Date(initialMessage.timestamp),
        });
        await conversation.save();
      }
    }

    // 🛠 Format messages for response
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
      conversationId: conversation._id.toString(),
      patientId: conversation.patientId.toString(),
      messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (err) {
    console.error("Error initializing conversation:", err);
    return NextResponse.json(
      { error: "Failed to initialize conversation" },
      { status: 500 }
    );
  }
}
