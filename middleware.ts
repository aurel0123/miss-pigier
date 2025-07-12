import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // ta fonction NextAuth() 

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], 
};
