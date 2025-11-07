import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { candidates } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Vérifier que l'ID est fourni
        if (!id) {
            return NextResponse.json(
                { error: "L'ID du candidat est requis" },
                { status: 400 }
            );
        }

        // Récupérer les données du body
        const body = await request.json();
        const { nom, prenom, filiere, description, image, nombreVotes } = body;

        // Validation des champs obligatoires
        if (!nom || !prenom || !filiere || !image) {
            return NextResponse.json(
                {
                    error: "Les champs nom, prénom, filière et image sont obligatoires"
                },
                { status: 400 }
            );
        }

        // Vérifier que le candidat existe
        const existingCandidate = await db
            .select()
            .from(candidates)
            .where(eq(candidates.id, id))
            .limit(1);

        if (existingCandidate.length === 0) {
            return NextResponse.json(
                { error: "Candidat non trouvé" },
                { status: 404 }
            );
        }

        // Préparer les données de mise à jour
        const updateData: any = {
            nom: nom.trim(),
            prenom: prenom.trim(),
            filiere: filiere.trim(),
            image: image.trim(),
        };

        // Ajouter la description si elle est fournie
        if (description !== undefined) {
            updateData.description = description.trim() || null;
        }

        // Ajouter nombreVotes si fourni (optionnel pour la modification)
        if (nombreVotes !== undefined) {
            updateData.nombreVotes = nombreVotes;
        }

        // Mettre à jour le candidat dans la base de données
        const updatedCandidate = await db
            .update(candidates)
            .set(updateData)
            .where(eq(candidates.id, id))
            .returning();

        return NextResponse.json(
            {
                message: "Candidat modifié avec succès",
                candidate: updatedCandidate[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du candidat:", error);
        return NextResponse.json(
            {
                error: "Erreur lors de la mise à jour du candidat",
                details: error instanceof Error ? error.message : "Erreur inconnue"
            },
            { status: 500 }
        );
    }
}