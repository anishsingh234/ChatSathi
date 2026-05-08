import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST — Create or update a knowledge doc
export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, title, content, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const tagArray = Array.isArray(tags) ? tags : (tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);

    if (id) {
      // Update existing
      const doc = await prisma.knowledgeDoc.update({
        where: { id },
        data: { title, content, tags: tagArray },
      });
      return NextResponse.json(doc);
    }

    // Create new
    const doc = await prisma.knowledgeDoc.create({
      data: { userId: user.id, title, content, tags: tagArray },
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Knowledge POST error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET — List all knowledge docs for the user
export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const docs = await prisma.knowledgeDoc.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(docs);
  } catch (error) {
    console.error("Knowledge GET error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE — Delete a knowledge doc
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await prisma.knowledgeDoc.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Knowledge DELETE error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
