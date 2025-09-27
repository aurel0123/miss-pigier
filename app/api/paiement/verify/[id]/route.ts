import { db } from '@/database/drizzle';
import { paiements } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paiementId = params.id;

    if (!paiementId) {
      return NextResponse.json(
        { error: 'ID de paiement requis' },
        { status: 400 }
      );
    }

    // Récupérer le paiement en base
    const [paiement] = await db.select()
      .from(paiements)
      .where(eq(paiements.id, paiementId));

    if (!paiement) {
      return NextResponse.json(
        { error: 'Paiement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      paiement: {
        id: paiement.id,
        status: paiement.status,
        montant: paiement.montant,
        numeroTel: paiement.numeroTel,
        createdAt: paiement.createdAt,
        validated: paiement.status === 'validated'
      },
      message: 'Statut du paiement récupéré'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    );
  }
}