import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId, businessName, supportEmail, knowledge } = await req.json();
    if (!ownerId) {
      return NextResponse.json(
        { message: "Owner ID is required" },
        { status: 400 },
      );
    }
    await connectDb();
    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      { ownerId, businessName, supportEmail, knowledge },
      { new: true, upsert: true },
    );
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error saving settings:", message);
    return NextResponse.json({ message: "Error saving settings", error: message }, { status: 500 });
  }
}
