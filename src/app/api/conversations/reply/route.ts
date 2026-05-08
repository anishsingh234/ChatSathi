import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST — Admin sends a reply to a conversation
export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { conversationId, content } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json({ message: "conversationId and content are required" }, { status: 400 });
    }

    // Verify the conversation belongs to this admin
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId: user.id },
    });

    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role: "admin",
      },
    });

    // Touch conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
