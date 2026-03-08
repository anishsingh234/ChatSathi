import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
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
    await connectDb();
    const settings = await Settings.findOne({ ownerId });
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching settings", error }, { status: 500 });
  }
}
