import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Basic JWT structure check (3 dot-separated parts)
  // Full verification happens server-side in getSession()
  const parts = token.split(".");
  if (parts.length !== 3) {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("access_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};