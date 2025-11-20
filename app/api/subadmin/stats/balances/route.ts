import { db } from "@/database/drizzle";
import { retray, commissions, paiements, evenements, admins } from "@/database/schema";
import { eq, sql, and, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Assurez-vous que le chemin est bon

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
  try {
    // 1. Vérification Authentification
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ---------------------------------------------------------
    // ÉTAPE 1 : Calculer les Sorties (Retraits demandés/validés)
    // ---------------------------------------------------------
    const statsRetraits = await db
      .select({
        // Somme des demandes en attente
        montantEnAttente: sql<number>`COALESCE(SUM(CASE WHEN ${retray.status} = 'en cour' THEN ${retray.montant_retrait} ELSE 0 END), 0)`.mapWith(Number),
        countEnAttente: sql<number>`COUNT(CASE WHEN ${retray.status} = 'en cour' THEN 1 END)`.mapWith(Number),
        
        // Somme des retraits validés (argent réellement sorti)
        montantValide: sql<number>`COALESCE(SUM(CASE WHEN ${retray.status} IN ('approuver', 'completer') THEN ${retray.montant_retrait} ELSE 0 END), 0)`.mapWith(Number),
        countValide: sql<number>`COUNT(CASE WHEN ${retray.status} IN ('approuver', 'completer') THEN 1 END)`.mapWith(Number),
      })
      .from(retray)
      .where(eq(retray.userId, userId));

    const retraits = statsRetraits[0];

    // ---------------------------------------------------------
    // ÉTAPE 2 : Calculer les Entrées (Commissions gagnées)
    // ---------------------------------------------------------
    // ⚠️ NOTE IMPORTANTE :
    // Dans votre schéma actuel, il n'y a pas de lien direct entre "evenements" et "admins".
    // Je suppose ici que VOUS ÊTES L'ADMIN PRINCIPAL et que vous touchez TOUTES les commissions 'partOrganisateur'.
    // Si chaque admin a ses propres événements, il faudrait ajouter 'ownerId' dans la table 'evenements'.
    
    const statsCommissions = await db
      .select({
        totalGagne: sql<number>`COALESCE(SUM(${commissions.partOrganisateur}), 0)`.mapWith(Number),
      })
      .from(commissions);
      // .innerJoin(paiements, eq(commissions.paiementId, paiements.id))
      // .innerJoin(evenements, eq(paiements.evenementId, evenements.id))
      // .where(eq(evenements.ownerId, userId)) // <--- C'est ici qu'il faudrait filtrer si multi-organisateurs

    const totalGagne = statsCommissions[0].totalGagne;

    // ---------------------------------------------------------
    // ÉTAPE 3 : Calcul du Solde Disponible
    // ---------------------------------------------------------
    // Solde = Total Gagné - (Total Déjà Retiré + Total En cours de demande)
    const soldeDisponible = totalGagne - (retraits.montantValide + retraits.montantEnAttente);

    return NextResponse.json({
      success: true,
      data: {
        // Carte 1 : Transactions approuvées (Total des gains historiques)
        totalGagne: totalGagne,
        
        // Carte 2 : Solde disponible (Ce qu'il peut encore retirer)
        soldeDisponible: soldeDisponible > 0 ? soldeDisponible : 0,
        
        // Carte 3 : Demande en attente
        enAttente: {
          montant: retraits.montantEnAttente,
          nombre: retraits.countEnAttente
        },
        
        // Carte 4 : Demande validée (Total retiré)
        totalRetire: {
            montant: retraits.montantValide,
            nombre: retraits.countValide
        }
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur API Stats:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}