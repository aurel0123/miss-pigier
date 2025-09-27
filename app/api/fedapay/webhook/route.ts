// app/api/fedapay/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { paiements , votes, candidates, commissions } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook FedaPay reçu:', body);

    const { entity, event_type } = body;

    if (event_type === 'transaction.approved') {
      const transactionId = entity.id;
      const customMetadata = entity.custom_metadata;
      const paiementId = customMetadata?.paiement_id;

      if (!paiementId) {
        console.error('ID de paiement manquant dans les métadonnées');
        return NextResponse.json({ error: 'ID de paiement manquant' }, { status: 400 });
      }

      // Récupérer le paiement en base
      const [paiement] = await db.select()
        .from(paiements)
        .where(eq(paiements.id, paiementId));

      if (!paiement) {
        console.error('Paiement non trouvé:', paiementId);
        return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 });
      }

      // Vérifier que le paiement n'est pas déjà traité
      if (paiement.status === 'validated') {
        console.log('Paiement déjà validé:', paiementId);
        return NextResponse.json({ message: 'Paiement déjà traité' });
      }

      // Extraire les métadonnées du paiement
      const candidatId = customMetadata?.candidat_id || paiement.metadata?.candidatId;
      const nombreVote = parseInt(customMetadata?.nombre_votes) || paiement.metadata?.nombreVote || 1;

      if (!candidatId) {
        console.error('ID candidat manquant dans les métadonnées');
        return NextResponse.json({ error: 'ID candidat manquant' }, { status: 400 });
      }

      // Traitement en transaction pour garantir la cohérence
      await db.transaction(async (trx) => {
        // 1. Mettre à jour le statut du paiement
        await trx.update(paiements)
          .set({ 
            status: 'validated',
            moyenPaiement: entity.mode || 'unknown',
            fedapayTransactionId: transactionId.toString(),
            metadata: {
              ...paiement.metadata,
              validated_at: new Date().toISOString(),
              fedapay_reference: entity.reference,
              transaction_id: transactionId
            }
          })
          .where(eq(paiements.id, paiementId));

        // 2. Créer l'enregistrement de vote
        await trx.insert(votes).values({
          numeroTel: paiement.numeroTel,
          candidatId: candidatId,
          paiementId: paiementId,
          nombreVote: nombreVote
        });

        // 3. Mettre à jour le nombre de votes du candidat
        const [currentCandidate] = await trx.select()
          .from(candidates)
          .where(eq(candidates.id, candidatId));

        if (currentCandidate) {
          await trx.update(candidates)
            .set({ 
              nombreVotes: (currentCandidate.nombreVotes || 0) + nombreVote 
            })
            .where(eq(candidates.id, candidatId));
        }

        // 4. Calculer et enregistrer les commissions (5% pour le site)
        const tauxCommission = 0.05;
        const partSite = Math.floor(paiement.montant * tauxCommission);
        const partOrganisateur = paiement.montant - partSite;

        await trx.insert(commissions).values({
          paiementId: paiementId,
          montantTotal: paiement.montant,
          partSite: partSite,
          partOrganisateur: partOrganisateur
        });
      });

      console.log(`✅ Paiement validé: ${paiementId}, Votes ajoutés: ${nombreVote}, Candidat: ${candidatId}`);
      
      return NextResponse.json({ 
        message: 'Paiement traité avec succès',
        paiementId,
        votesAjoutes: nombreVote,
        candidatId
      });

    } else if (event_type === 'transaction.declined') {
      const paiementId = entity.custom_metadata?.paiement_id;
      
      if (paiementId) {
        await db.update(paiements)
          .set({ 
            status: 'cancelled',
            fedapayTransactionId: entity.id?.toString(),
            metadata: {
              cancelled_at: new Date().toISOString(),
              reason: 'transaction_declined',
              transaction_id: entity.id
            }
          })
          .where(eq(paiements.id, paiementId));

        console.log(`❌ Paiement annulé: ${paiementId}`);
      }

      return NextResponse.json({ message: 'Paiement annulé' });
    }

    console.log(`ℹ️ Événement non géré: ${event_type}`);
    return NextResponse.json({ message: 'Événement reçu mais non traité', event_type });

  } catch (error) {
    console.error('❌ Erreur webhook FedaPay:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook', details: error.message },
      { status: 500 }
    );
  }
}

// Endpoint GET pour vérifier que le webhook est actif
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook FedaPay actif',
    timestamp: new Date().toISOString()
  });
}