import { auth } from "@/auth";
import { db } from "@/database/drizzle" ;
import { candidates, votes, commissions, paiements } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
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
      if (role !== "subadmin") {
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
    const result = await db
        .select({
            candidateId: candidates.id,
            nom: candidates.nom,
            prenom: candidates.prenom,
            nombreVotes: votes.nombreVote,
            montantTotal: commissions.montantTotal,
            partOrganisateur: commissions.partOrganisateur,
        })
        .from(candidates)
        .innerJoin(votes, eq(candidates.id, votes.candidatId))
        .innerJoin(paiements, eq(votes.paiementId, paiements.id))
        .innerJoin(commissions, eq(paiements.id, commissions.paiementId));

    if (result && result.length > 0){
        return new Response(JSON.stringify(result, null, 2),
            {
                status : 201,
                headers: { "Content-Type": "application/json" }
            }
        )
    }else {
        return  new Response (JSON.stringify({message: 'Erreur lors du chargement'}) ,
            {
                status : 404,
                headers: { "Content-Type": "application/json" }
            })
    }
}