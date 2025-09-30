"use server"
import {db} from '@/database/drizzle'
import {paiements } from '@/database/schema'

export async function GET() {
    const paiement_and_votes = await db
        .select()
        .from(paiements)

    if (paiement_and_votes && paiement_and_votes.length > 0) {
        return new Response(JSON.stringify(paiement_and_votes, null, 2),
            {
                status : 201,
                headers: { "Content-Type": "application/json" }
            }
            )
    }else {
        return  new Response (JSON.stringify({message: 'Error pas de payment'}) ,
            {
                status : 404,
                headers: { "Content-Type": "application/json" }
            })
    }
}