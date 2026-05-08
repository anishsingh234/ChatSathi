import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId } = await req.json();
    if (!ownerId) {
      return NextResponse.json(
        { message: "Owner ID is required" },
        { status: 400 },
      );
    }

    const settings = await prisma.settings.findUnique({
      where: { userId: ownerId },
    });

    return NextResponse.json(settings || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching settings", error },
      { status: 500 },
    );
  }
}
