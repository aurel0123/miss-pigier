import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { evenements } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
        }

        const evenement = await db
            .select()
            .from(evenements)
            .where(and(eq(evenements.id, id), eq(evenements.publish, true)))
            .limit(1);

        if (evenement.length === 0) {
            return NextResponse.json(
                { success: false, error: "Aucun événement trouvé ou non publié" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: evenement[0],
        });
    } catch (error) {
        console.error("Erreur GET /Evenement/get/[id] :", error);
        return NextResponse.json(
            { success: false, error: "Erreur lors de la récupération de l'événement" },
            { status: 500 }
        );
    }
}
