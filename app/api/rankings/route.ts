import {db} from '@/database/drizzle'
import {candidates} from '@/database/schema'
import { desc } from "drizzle-orm";


export async function GET() {
   const  rankings = await db
       .select()
       .from(candidates)
       .orderBy(desc(candidates.nombreVotes))


    if (rankings && rankings.length > 0) {
        return new Response ( JSON.stringify(rankings , null, 2) , {
            status: 201,
            headers: { "Content-Type": "application/json" }
        })
    }else {
        return  new Response (JSON.stringify({message : "Erreur lors de la recuperation"}) , {
            status : 404 , headers: { "Content-Type": "application/json" }
        })
    }
}