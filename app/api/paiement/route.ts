import { db } from '@/database/drizzle';
import { paiements } from '@/database/schema';
import { NextRequest, NextResponse } from 'next/server';
import { voteLimiter } from '@/lib/ratelimit';

export async function POST(request: NextRequest) { 
  try {
    const body = await request.json();
    const { numeroTel, montant, evenementId, candidatId, nombreVote } = body;

    if (!numeroTel || !montant || !evenementId || !candidatId || !nombreVote) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // -------------------------------
    // 🔒 RATE LIMIT PAR TÉLÉPHONE OU IP
    // -------------------------------
    // Tu peux choisir l'identifiant : IP, numéro, ou combinaison des deux
    const ip = request.headers.get("x-forwarded-for") ||
      "unknown-ip";

    const phoneKey = numeroTel.replace(/\s/g, "");

    // Ici je combine IP + numéro pour être plus strict
    const identifier = `vote:${ip}:${phoneKey}`;

    const { success } = await voteLimiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Trop de tentatives de vote. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }
    // -------------------------------

    const phoneRegex = /^(\+229|00229)?\d{10}$/;
    if (!phoneRegex.test(numeroTel.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Format de numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    const [newPaiement] = await db.insert(paiements).values({  
      numeroTel: numeroTel.replace(/\s/g, ''), // Supprimer les espaces
      montant,
      status: 'pending',
      evenementId,
      metadata: {
        candidatId,
        nombreVote,
        createdFrom: 'vote_modal'
      }
    }).returning();

    return NextResponse.json({
      success: true,
      paiementId: newPaiement.id,
      message: 'Paiement créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la création du paiement' },
      { status: 500 }
    );
  }
}