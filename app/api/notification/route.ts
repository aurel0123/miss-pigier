"use server";
import { db } from "@/database/drizzle";
import { Notification } from "@/database/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const getnotifications = await db.select().from(Notification);
    if (getnotifications && getnotifications.length > 0) {
      return NextResponse.json({ success: true, data: getnotifications }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: true, data: [], message: "Aucune notification trouvée" },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("GET /api/notification:", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
