"use server"
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { evenements } from "@/database/schema";
import { EvenementSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validation des données reçues
    const parsed = EvenementSchema.parse({
      ...json,
      // Convertir les dates en objets Date si elles sont en string
      date_debut: json.date_debut ? new Date(json.date_debut) : undefined,
      date_fin: json.date_fin ? new Date(json.date_fin) : undefined,
    });

    // Insertion dans la base de données
    const result = await db
      .insert(evenements)
      .values({
        titre: parsed.titre,
        description: parsed.description || "",
        image: parsed.image || "",
        prixUnitaireVote: parsed.prix_unitaire,
        dateDebut: parsed.date_debut,
        dateFin: parsed.date_fin,
        // status par défaut pris en base
      })
      .returning();

    return NextResponse.json({ success: true, evenement: result[0] });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Erreur inconnue" }, { status: 500 });
  }
}
