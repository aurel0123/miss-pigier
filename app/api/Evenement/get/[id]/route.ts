// app/api/Evenement/get/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { evenements } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const rows = await db
      .select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: rows[0] }, // ⬅️ data, pas evenement
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET événement:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}