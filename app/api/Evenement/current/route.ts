import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { evenements } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {

        const currentEvent = await db
            .select()
            .from(evenements)
            .where(eq(evenements.publish, true))
            .limit(1);


        if (!currentEvent || currentEvent.length === 0) {
            return NextResponse.json(
                { success: false, message: "Aucun événement actuellement publié." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, evenement: currentEvent[0] },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Erreur lors de la récupération de l'événement actuel:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Erreur interne du serveur",
            },
            { status: 500 }
        );
    }
}
