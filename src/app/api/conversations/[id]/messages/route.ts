import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET — Public endpoint for widget to poll new messages (includes admin replies)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const after = req.nextUrl.searchParams.get("after");

  try {
    const where: Record<string, unknown> = { conversationId: id };
    if (after) {
      where.createdAt = { gt: new Date(after) };
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        content: true,
        role: true,
        createdAt: true,
      },
    });

    return corsJson(messages, 200);
  } catch (error) {
    console.error("Messages poll error:", error);
    return corsJson({ message: "Server error" }, 500);
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
