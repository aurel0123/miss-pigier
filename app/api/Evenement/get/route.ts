import { db } from "@/database/drizzle";
import { evenements } from "@/database/schema";
import {  eq , asc } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const now = new Date();

        // Récupère tous les événements, triés par date de création
        const allEvents = await db
            .select()
            .from(evenements)
            .orderBy(asc(evenements.createdAt));

        // Si aucun événement
        if (allEvents.length === 0) {
            return NextResponse.json(
                { success: true, message: "Aucun événement trouvé", evenements: [] },
                { status: 200 }
            );
        }

        // Déterminer le statut dynamique de chaque événement
        const updatedEvents = await Promise.all(
            allEvents.map(async (event) => {
                let newStatus = event.status; // garder le statut actuel par défaut

                if (event.dateDebut && event.dateFin) {
                    const start = new Date(event.dateDebut);
                    const end = new Date(event.dateFin);

                    if (now < start) newStatus = "A VENIR";
                    else if (now >= start && now <= end) newStatus = "EN COUR";
                    else if (now > end) newStatus = "TERMINER";
                }

                // Si le statut a changé, mettre à jour dans la base
                if (newStatus !== event.status) {
                    await db
                        .update(evenements)
                        .set({ status: newStatus })
                        .where(eq(evenements.id, event.id));
                }

                return { ...event, status: newStatus };
            })
        );

        // Retourner les événements avec le bon statut
        return NextResponse.json(
            { success: true, evenements: updatedEvents },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        return NextResponse.json(
            { success: false, error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
