import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      ownerId,
      businessName,
      supportEmail,
      knowledge,
      // Theme fields
      primaryColor,
      headerBg,
      botBubbleBg,
      userBubbleGrad1,
      userBubbleGrad2,
      chatBg,
      welcomeMessage,
      chatTitle,
    } = await req.json();

    if (!ownerId) {
      return NextResponse.json(
        { message: "Owner ID is required" },
        { status: 400 },
      );
    }

    const data = {
      businessName,
      supportEmail,
      knowledge,
      primaryColor,
      headerBg,
      botBubbleBg,
      userBubbleGrad1,
      userBubbleGrad2,
      chatBg,
      welcomeMessage,
      chatTitle,
    };

    // Remove undefined keys so partial updates work
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );

    const settings = await prisma.settings.upsert({
      where: { userId: ownerId },
      update: cleaned,
      create: { userId: ownerId, ...cleaned },
    });

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error saving settings:", message);
    return NextResponse.json(
      { message: "Error saving settings", error: message },
      { status: 500 },
    );
  }
}
