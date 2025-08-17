// app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { paiements, votes, candidates } from '@/database/schema';
import { eq, sql } from 'drizzle-orm';
import crypto from 'crypto';

const FEDAPAY_WEBHOOK_SECRET = process.env.FEDAPAY_WEBHOOK_SECRET;

// Fonction pour vérifier la signature du webhook
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expectedSignature}`),
    Buffer.from(signature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-fedapay-signature');

    // Vérification de la signature (sécurité)
    if (FEDAPAY_WEBHOOK_SECRET && signature) {
      if (!verifyWebhookSignature(body, signature, FEDAPAY_WEBHOOK_SECRET)) {
        console.error('Signature webhook invalide');
        return NextResponse.json(
          { error: 'Signature invalide' },
          { status: 401 }
        );
      }
    }

    const webhookData = JSON.parse(body);
    const { entity, event_type } = webhookData;

    console.log(`Webhook reçu: ${event_type}`, entity);

    // Traiter seulement les événements de transaction
    if (entity.entity !== 'transaction') {
      return NextResponse.json({ received: true });
    }

    const fedapayTransactionId = entity.id;
    const transactionStatus = entity.status;
    const customMetadata = entity.custom_metadata || {};

    // Récupérer l'enregistrement de paiement
    const [paiementRecord] = await db
      .select()
      .from(paiements)
      .where(eq(paiements.fedapayTransactionId, fedapayTransactionId))
      .limit(1);

    if (!paiementRecord) {
      console.error(`Paiement non trouvé pour la transaction FedaPay: ${fedapayTransactionId}`);
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    // Traitement selon le statut de la transaction
    switch (transactionStatus) {
      case 'approved':
      case 'completed':
        await handleSuccessfulPayment(paiementRecord, entity, customMetadata);
        break;
      
      case 'declined':
      case 'failed':
        await handleFailedPayment(paiementRecord, entity);
        break;
      
      case 'pending':
        await handlePendingPayment(paiementRecord, entity);
        break;
      
      default:
        console.log(`Statut non traité: ${transactionStatus}`);
    }

    return NextResponse.json({ received: true, status: transactionStatus });

  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(paiementRecord: any, entity: any, customMetadata: any) {
  try {
    console.log(`Traitement du paiement réussi: ${paiementRecord.id}`);

    // Mise à jour du statut de paiement
    await db.update(paiements)
      .set({
        status: 'completed',
        metadata: {
          ...paiementRecord.metadata,
          fedapay_completion: entity,
          processed_at: new Date().toISOString()
        }
      })
      .where(eq(paiements.id, paiementRecord.id));

    // Extraction des métadonnées
    const candidatId = customMetadata.candidat_id || paiementRecord.metadata?.candidatId;
    const nombreVotes = customMetadata.nombre_votes || paiementRecord.metadata?.nombreVotes;

    if (!candidatId || !nombreVotes) {
      throw new Error('Métadonnées manquantes pour créer les votes');
    }

    // Création des enregistrements de votes
    const votePromises = [];
    for (let i = 0; i < nombreVotes; i++) {
      votePromises.push(
        db.insert(votes).values({
          numeroTel: paiementRecord.numeroTel,
          candidatId: candidatId,
          paiementId: paiementRecord.id,
        })
      );
    }

    await Promise.all(votePromises);

    // Mise à jour du compteur de votes du candidat
    await db.update(candidates)
      .set({
        nombreVotes: sql`${candidates.nombreVotes} + ${nombreVotes}`
      })
      .where(eq(candidates.id, candidatId));

    // Calcul et sauvegarde des commissions
    const montantTotal = paiementRecord.montant;
    const commission = Math.round(montantTotal * 0.18); // 18%
    const montantOrganisateur = montantTotal - commission;

    await db.update(paiements)
      .set({
        metadata: {
          ...paiementRecord.metadata,
          commission_plateforme: commission,
          montant_organisateur: montantOrganisateur,
          commission_calculee_at: new Date().toISOString()
        }
      })
      .where(eq(paiements.id, paiementRecord.id));

    console.log(`✅ Paiement traité avec succès: ${nombreVotes} votes ajoutés pour le candidat ${candidatId}`);

  } catch (error) {
    console.error('Erreur lors du traitement du paiement réussi:', error);
    
    // Marquer le paiement comme ayant une erreur de traitement
    await db.update(paiements)
      .set({
        status: 'processing_error',
        metadata: {
          ...paiementRecord.metadata,
          processing_error: error.message,
          error_at: new Date().toISOString()
        }
      })
      .where(eq(paiements.id, paiementRecord.id));
  }
}

async function handleFailedPayment(paiementRecord: any, entity: any) {
  console.log(`Paiement échoué: ${paiementRecord.id}`);
  
  await db.update(paiements)
    .set({
      status: 'failed',
      metadata: {
        ...paiementRecord.metadata,
        fedapay_failure: entity,
        failed_at: new Date().toISOString()
      }
    })
    .where(eq(paiements.id, paiementRecord.id));
}

async function handlePendingPayment(paiementRecord: any, entity: any) {
  console.log(`Paiement en attente: ${paiementRecord.id}`);
  
  await db.update(paiements)
    .set({
      metadata: {
        ...paiementRecord.metadata,
        fedapay_pending: entity,
        last_update: new Date().toISOString()
      }
    })
    .where(eq(paiements.id, paiementRecord.id));
}