import { getSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ email: null });
    }
    return NextResponse.json({ email: session?.user?.email ?? null });
}
