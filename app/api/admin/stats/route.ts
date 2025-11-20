import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { candidates, votes, commissions, paiements } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const { role, is_active } = session?.user as any;
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé : veuillez vous connecter." },
      { status: 401 }
    );
  }
  if (!is_active && role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        error: "Compte inactif : accès refusé.",
      },
      { status: 403 }
    );
  }

  const result = await db
    .select({
      candidateId: candidates.id,
      nom: candidates.nom,
      prenom: candidates.prenom,
      nombreVotes: votes.nombreVote,
      montantTotal: commissions.montantTotal,
      partSite: commissions.partSite,
      partOrganisateur: commissions.partOrganisateur,
    })
    .from(candidates)
    .innerJoin(votes, eq(candidates.id, votes.candidatId))
    .innerJoin(paiements, eq(votes.paiementId, paiements.id))
    .innerJoin(commissions, eq(paiements.id, commissions.paiementId));

  if (result && result.length > 0) {
    return new Response(JSON.stringify(result, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(
      JSON.stringify({ message: "Erreur lors du chargement" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}