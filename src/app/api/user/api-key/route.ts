import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { apiKey } = await req.json();
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({ message: "API key is required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { geminiApiKey: apiKey.trim() },
    });

    return NextResponse.json({ message: "API key saved successfully" });
  } catch (error) {
    console.error("Error saving API key:", error);
    return NextResponse.json({ message: "Failed to save API key" }, { status: 500 });
  }
}
