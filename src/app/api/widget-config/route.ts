import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Public endpoint — called by the chatBot.js embed script
export async function GET(req: NextRequest) {
  try {
    const ownerId = req.nextUrl.searchParams.get("ownerId");

    if (!ownerId) {
      return corsJson({ message: "ownerId is required" }, 400);
    }

    const settings = await prisma.settings.findUnique({
      where: { userId: ownerId },
      select: {
        primaryColor: true,
        headerBg: true,
        botBubbleBg: true,
        userBubbleGrad1: true,
        userBubbleGrad2: true,
        chatBg: true,
        welcomeMessage: true,
        chatTitle: true,
        businessName: true,
      },
    });

    // Return defaults if no settings exist
    const config = {
      primaryColor: settings?.primaryColor || "#7c3aed",
      headerBg: settings?.headerBg || "#0f0e17",
      botBubbleBg: settings?.botBubbleBg || "rgba(255,255,255,0.05)",
      userBubbleGrad1: settings?.userBubbleGrad1 || "#635bff",
      userBubbleGrad2: settings?.userBubbleGrad2 || "#8b5cf6",
      chatBg: settings?.chatBg || "#0f0e17",
      welcomeMessage:
        settings?.welcomeMessage || "Hey! 👋 How can I help you today?",
      chatTitle: settings?.chatTitle || "ChatSathi",
    };

    return corsJson(config, 200);
  } catch (error) {
    console.error("widget-config error:", error);
    return corsJson({ message: "Failed to load config" }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function corsJson(body: unknown, status: number) {
  const res = NextResponse.json(body, { status });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
