import { db } from '@/database/drizzle';
import { paiements } from '@/database/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) { 
    try{
        const body = await request.json()
        const { numeroTel, montant, evenementId, candidatId, nombreVote } = body;

        if(!numeroTel || !montant || !evenementId || !candidatId || !nombreVote){
            return NextResponse.json(
                {error : "Tous les champs sont requis"}, 
                {status : 400}
            )
        }
        const phoneRegex = /^(\+229|00229)?\d{10}$/;
        if (!phoneRegex.test(numeroTel.replace(/\s/g, ''))) {
            return NextResponse.json(
                { error: 'Format de numéro de téléphone invalide' },
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
    } catch(error){
        console.error('Erreur lors de la création du paiement:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la création du paiement' },
            { status: 500 }
        );
    }
}