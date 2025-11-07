import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {next} from "@zag-js/utils"; // ta fonction NextAuth()

export async function middleware(req: NextRequest) {
    const session = await auth();
    const url = req.nextUrl

    if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/admin", req.url));
    }

    const { role , is_active } = session?.user as any ;
    if(!is_active) {
      return NextResponse.redirect(new URL("/auth/admin", req.url));
    }
    const path = url.pathname
    if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(`/${role}`, req.url))
    }

    // Si l'utilisateur n'est pas subadmin → il ne peut pas aller dans /subadmin
    if (path.startsWith("/subadmin") && !["admin", "subadmin"].includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url))
    }

    // Si l'utilisateur n'est pas Responsable → il ne peut pas aller dans /responsable
    if (path.startsWith("/responsable") && !["admin", "Responsable"].includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*" , "/subadmin/:path*", "/responsable/:path*" ],
};
