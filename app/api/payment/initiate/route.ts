// app/api/payment/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { paiements } from '@/database/schema';
import { v4 as uuidv4 } from 'uuid';
import config from '@/lib/config';
import { eq } from 'drizzle-orm';

// Configuration FedaPay
const FEDAPAY_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.fedapay.com/v1' 
  : 'https://sandbox-api.fedapay.com/v1';

const FEDAPAY_API_KEY = config.env.fedapay.privateKey;
//const FEDAPAY_PUBLIC_KEY = config.env.fedapay.publicKey;
const BASE_URL = config.env.apiEndpoint;

interface PaymentRequest {
  candidatId: string;
  evenementId: string;
  numeroTelephone: string;
  nombreVotes: number;
  montant: number;
  moyenPaiement: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    
    // Validation des données
    const { candidatId, evenementId, numeroTelephone, nombreVotes, montant, moyenPaiement, metadata } = body;
    
    if (!candidatId || !evenementId || !numeroTelephone || !nombreVotes || !montant) {
      return NextResponse.json(
        { success: false, message: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Validation du numéro de téléphone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(numeroTelephone)) {
      return NextResponse.json(
        { success: false, message: 'Format de numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Génération d'un ID unique pour la transaction
    const transactionId = uuidv4();
    
    // Création de l'enregistrement de paiement en attente
    const [paiementRecord] = await db.insert(paiements).values({
      id: transactionId,
      numeroTel: numeroTelephone,
      montant: montant,
      evenementId: evenementId,
      status: 'pending',
      moyenPaiement: moyenPaiement,
      metadata: {
        candidatId,
        nombreVotes,
        prix_par_vote: montant / nombreVotes,
        ...metadata
      }
    }).returning();

    // Préparation des données pour FedaPay
    const fedapayData = {
      amount: montant,
      currency: {
        iso: 'XOF' // Franc CFA
      },
      description: `Vote pour ${metadata?.candidat_nom || 'candidat'} - ${nombreVotes} vote(s)`,
      callback_url: `${BASE_URL}/api/payment/webhook`,
      cancel_url: `${BASE_URL}/vote/cancel?transaction=${transactionId}`,
      return_url: `${BASE_URL}/vote/success?transaction=${transactionId}`,
      custom_metadata: {
        transaction_id: transactionId,
        candidat_id: candidatId,
        evenement_id: evenementId,
        nombre_votes: nombreVotes,
        numero_telephone: numeroTelephone
      }
    };

    // Appel à l'API FedaPay pour créer la transaction
    const fedapayResponse = await fetch(`${FEDAPAY_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fedapayData),
    });

    const fedapayResult = await fedapayResponse.json();

    if (!fedapayResponse.ok) {
      console.error('Erreur FedaPay:', fedapayResult);
      
    // Mettre à jour le statut en cas d'erreur
      await db.update(paiements)
        .set({ 
          status: 'failed',
          metadata: {
            ...(paiementRecord.metadata || {}),
            error: fedapayResult.message || 'Erreur FedaPay'
          }
        })
        .where(eq(paiements.id, transactionId));

      return NextResponse.json(
        { 
          success: false, 
          message: fedapayResult.message || 'Erreur lors de la création de la transaction' 
        },
        { status: 400 }
      );
    }

    // Log the full response for debugging
    console.log('FedaPay response:', fedapayResult);

    // Handle different response structures
    let transactionIdFromFedapay: string;
    
    // Check if response has v1/transaction structure (new format)
    if (fedapayResult['v1/transaction'] && fedapayResult['v1/transaction'].id) {
      transactionIdFromFedapay = fedapayResult['v1/transaction'].id as string;
    }
    // Check if response has v1 structure
    else if (fedapayResult.v1 && fedapayResult.v1.id) {
      transactionIdFromFedapay = fedapayResult.v1.id as string;
    } 
    // Check if response has direct id
    else if (fedapayResult.id) {
      transactionIdFromFedapay = fedapayResult.id as string;
    }
    // Check if response has data structure
    else if (fedapayResult.data && fedapayResult.data.id) {
      transactionIdFromFedapay = fedapayResult.data.id as string;
    }
    else {
      console.error('Unexpected FedaPay response structure:', fedapayResult);
      
      await db.update(paiements)
        .set({ 
          status: 'failed',
          metadata: {
            ...(paiementRecord.metadata || {}),
            error: 'Structure de réponse FedaPay inattendue',
            fedapay_response: fedapayResult
          }
        })
        .where(eq(paiements.id, transactionId));

      return NextResponse.json(
        { 
          success: false, 
          message: 'Erreur: structure de réponse FedaPay inattendue' 
        },
        { status: 500 }
      );
    }

    // Mise à jour avec l'ID de transaction FedaPay
    await db.update(paiements)
      .set({ 
        fedapayTransactionId: transactionIdFromFedapay,
        metadata: {
          ...(paiementRecord.metadata || {}),
          fedapay_response: fedapayResult
        }
      })
      .where(eq(paiements.id, transactionId));

    // Génération de l'URL de paiement
    const checkoutUrl = `${FEDAPAY_API_URL.replace('api.', 'checkout.')}/transactions/${transactionIdFromFedapay}`;

    return NextResponse.json({
      success: true,
      transaction_id: transactionId,
      fedapay_transaction_id: transactionIdFromFedapay,
      checkout_url: checkoutUrl,
      montant: montant,
      message: 'Transaction créée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'initiation du paiement:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}