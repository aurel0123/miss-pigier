import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { paiements, votes, candidates, commissions, evenements } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('🔄 Webhook FedaPay reçu:', JSON.stringify(body, null, 2));

        // ✅ FedaPay utilise "name" pas "event_types"
        const { entity, name: eventName } = body;

        if (eventName === 'transaction.approved') {
            const transactionId = entity.id;
            const customMetadata = entity.custom_metadata;
            const paiementId = customMetadata?.paiement_id;

            console.log('📋 Métadonnées reçues:', customMetadata);

            if (!paiementId) {
                console.error('❌ ID de paiement manquant dans les métadonnées');
                return NextResponse.json({ error: 'ID de paiement manquant' }, { status: 400 });
            }

            // Récupérer le paiement en base
            // Récupérer le paiement + la commission de l'événement
            const [row] = await db
            .select({
                paiement: paiements,
                eventCommission: evenements.commissions,
            })
            .from(paiements)
            .innerJoin(evenements, eq(paiements.evenementId, evenements.id))
            .where(eq(paiements.id, paiementId));

            if (!row) {
            console.error('❌ Paiement non trouvé:', paiementId);
            return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 });
            }

            const paiement = row.paiement;
            const commissionPourcentage = row.eventCommission ?? 35; // fallback 35% si null


            // Vérifier que le paiement n'est pas déjà traité
            if (paiement.status === 'validated') {
                console.log('✅ Paiement déjà validé:', paiementId);
                return NextResponse.json({ message: 'Paiement déjà traité' });
            }

            // Extraire les métadonnées du paiement
            const paiementMetadata = paiement.metadata as { candidatId?: string; nombreVote?: number } || {};
            const candidatId = customMetadata?.candidat_id || paiementMetadata.candidatId;
            const nombreVote = parseInt(customMetadata?.nombre_votes) || paiementMetadata.nombreVote || 1;

            console.log('🎯 Candidat ID:', candidatId, 'Nombre votes:', nombreVote);

            if (!candidatId) {
                console.error('❌ ID candidat manquant dans les métadonnées');
                return NextResponse.json({ error: 'ID candidat manquant' }, { status: 400 });
            }

            // Vérifier que le candidat existe
            const [candidat] = await db.select()
                .from(candidates)
                .where(eq(candidates.id, candidatId));

            if (!candidat) {
                console.error('❌ Candidat non trouvé:', candidatId);
                return NextResponse.json({ error: 'Candidat non trouvé' }, { status: 404 });
            }

            // Traitement en transaction pour garantir la cohérence
            await db.transaction(async (trx) => {
                console.log('🔄 Début de la transaction...');

                // 1. Mettre à jour le statut du paiement
                await trx.update(paiements)
                    .set({
                        status: 'validated' as const,
                        moyenPaiement: entity.mode || 'unknown',
                        fedapayTransactionId: transactionId.toString(),
                        metadata: {
                            ...paiement.metadata,
                            validated_at: new Date().toISOString(),
                            fedapay_reference: entity.reference,
                            transaction_id: transactionId,
                            amount: entity.amount,
                            fees: entity.fees
                        }
                    })
                    .where(eq(paiements.id, paiementId));

                console.log('✅ Paiement mis à jour');

                // 2. Créer l'enregistrement de vote
                const [newVote] = await trx.insert(votes).values({
                    numeroTel: paiement.numeroTel,
                    candidatId: candidatId,
                    paiementId: paiementId,
                    nombreVote: nombreVote
                }).returning();

                console.log('✅ Vote créé:', newVote.id);

                // 3. Mettre à jour le nombre de votes du candidat
                await trx.update(candidates)
                    .set({
                        nombreVotes: (candidat.nombreVotes || 0) + nombreVote
                    })
                    .where(eq(candidates.id, candidatId));

                console.log('✅ Candidat mis à jour - nouveaux votes:', (candidat.nombreVotes || 0) + nombreVote);

                // 4. Calculer et enregistrer les commissions (35% pour le site)
                // 4. Calculer et enregistrer les commissions selon l'événement
                const tauxCommission = (commissionPourcentage / 100);

                // On peut sécuriser un peu :
                const taux = Math.min(Math.max(tauxCommission, 0), 1); // entre 0 et 1

                const partSite = Math.floor(paiement.montant * taux);
                const partOrganisateur = paiement.montant - partSite;

                const [newCommission] = await trx.insert(commissions).values({
                paiementId: paiementId,
                montantTotal: paiement.montant,
                partSite,
                partOrganisateur,
                }).returning();

                console.log('✅ Commission créée:', newCommission.id);
            });

            console.log(`🎉 Traitement réussi:
        - Paiement: ${paiementId}
        - Votes ajoutés: ${nombreVote}
        - Candidat: ${candidatId}
        - Transaction FedaPay: ${transactionId}`);

            return NextResponse.json({
                success: true,
                message: 'Paiement traité avec succès',
                data: {
                    paiementId,
                    votesAjoutes: nombreVote,
                    candidatId,
                    transactionId
                }
            });

        } else if (eventName === 'transaction.declined') {
            const paiementId = entity.custom_metadata?.paiement_id;

            if (paiementId) {
                await db.update(paiements)
                    .set({
                        status: 'cancelled' as const,
                        fedapayTransactionId: entity.id?.toString(),
                        metadata: {
                            cancelled_at: new Date().toISOString(),
                            reason: 'transaction_declined',
                            transaction_id: entity.id,
                            last_error_code: entity.last_error_code
                        }
                    })
                    .where(eq(paiements.id, paiementId));

                console.log(`❌ Paiement annulé: ${paiementId}`);

                return NextResponse.json({
                    success: true,
                    message: 'Paiement annulé',
                    paiementId
                });
            }

            return NextResponse.json({
                success: false,
                message: 'ID paiement manquant pour l\'annulation'
            });
        }

        console.log(`ℹ️ Événement non géré: ${eventName}`);
        return NextResponse.json({
            success: false,
            message: 'Événement reçu mais non traité',
            eventName
        });

    } catch (error) {
        console.error('❌ Erreur webhook FedaPay:', error);
        console.error('Stack trace:', error.stack);

        return NextResponse.json(
            {
                success: false,
                error: 'Erreur lors du traitement du webhook',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// Endpoint GET pour vérifier que le webhook est actif
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Webhook FedaPay actif',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
}