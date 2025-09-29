import {db} from '@/database/drizzle'
import {paiements , votes} from '@/database/schema'
import {eq} from "drizzle-orm";

export async function GET() {
    const paiement_and_votes = await db
        .select()
        .from(paiements)
        .leftJoin(votes , eq(paiements.id , votes.paiementId))

    if (paiement_and_votes && paiement_and_votes.length > 0) {
        return new Response(JSON.stringify(paiement_and_votes, null, 2),
            {
                status : 201,
                headers: { "Content-Type": "application/json" }
            }
            )
    }else {
        return  new Response (JSON.stringify({message: 'Error pas de payement'}) ,
            {
                status : 404,
                headers: { "Content-Type": "application/json" }
            })
    }
}