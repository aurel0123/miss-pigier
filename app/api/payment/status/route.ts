// app/api/payment/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { paiements, candidates } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transaction');

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'ID de transaction requis' },
        { status: 400 }
      );
    }

    // Récupérer les informations de paiement avec les détails du candidat
    const result = await db
      .select({
        paiement: paiements,
        candidat: {
          id: candidates.id,
          nom: candidates.nom,
          prenom: candidates.prenom,
          image: candidates.image
        }
      })
      .from(paiements)
      .leftJoin(candidates, eq(candidates.id, paiements.metadata.candidatId))
      .where(eq(paiements.id, transactionId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    const { paiement, candidat } = result[0];

    // Formatage des données pour la réponse
    const paymentInfo = {
      transaction_id: paiement.id,
      montant: paiement.montant,
      nombreVotes: paiement.metadata?.nombreVotes || 0,
      candidat: candidat ? {
        id: candidat.id,
        nom: candidat.nom,
        prenom: candidat.prenom,
        image: candidat.image
      } : null,
      status: paiement.status,
      moyenPaiement: paiement.moyenPaiement,
      createdAt: paiement.createdAt,
      numeroTel: paiement.numeroTel,
      commission: paiement.metadata?.commission_plateforme || null,
      montantOrganisateur: paiement.metadata?.montant_organisateur || null
    };

    return NextResponse.json({
      success: true,
      payment: paymentInfo,
      message: 'Informations récupérées avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}