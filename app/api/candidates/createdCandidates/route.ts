import { z } from "zod";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { candidateSchema } from "@/lib/validations";
import { db } from "@/database/drizzle";
import { candidates, evenements } from "@/database/schema";
import { auth } from "@/auth";

const createCandidatesSchema = z.object({
  students: z.array(candidateSchema).min(1, "Au moins un candidat est requis"),
});

export async function POST(request: NextRequest) {
  // 1. Authentification
  const session = await auth();

  // Vérification stricte de la session
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé : veuillez vous connecter." },
      { status: 401 }
    );
  }

  // Typage plus sûr (évitez le 'as any' si possible, mais pour l'exemple on sécurise l'accès)
  const { role, is_active } = session.user as {
    role?: string;
    is_active?: boolean;
  };

  // 2. Autorisation (RBAC - Role Based Access Control)
  // Pour voir des données financières, il faut impérativement être ADMIN.
  if (role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Interdit : Droits d'administrateur requis." },
      { status: 403 }
    );
  }

  // Vérification du statut du compte
  if (is_active === false) {
    return NextResponse.json(
      { success: false, error: "Compte inactif : accès refusé." },
      { status: 403 }
    );
  }
  try {
    const body = await request.json();

    // Validation du body
    const validation = createCandidatesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { students } = validation.data;
    const evenementIds = [
      ...new Set(students.map((student) => student.evenementId)),
    ];
    if (evenementIds.length > 1) {
      return NextResponse.json(
        { error: "Tous les candidats doivent appartenir au même événement" },
        { status: 400 }
      );
    }

    const evenementId = evenementIds[0];
    const evenement = await db
      .select()
      .from(evenements)
      .where(eq(evenements.id, evenementId))
      .limit(1);

    if (evenement.length === 0) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }
    const candidatesData = students.map((student) => ({
      nom: student.nom,
      prenom: student.prenom,
      filiere: student.filiere,
      description: student.description || null,
      image: student.image,
      nombreVotes: student.nombreVotes,
      evenementId: student.evenementId,
    }));
    const insertedCandidates = await db
      .insert(candidates)
      .values(candidatesData)
      .returning();

    return NextResponse.json(
      {
        message: `${insertedCandidates.length} candidat(s) créé(s) avec succès`,
        candidates: insertedCandidates,
        evenement: evenement[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création des candidats:", error);

    // Gestion d'erreurs spécifiques
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Erreur de validation", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
