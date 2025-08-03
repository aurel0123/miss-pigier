import { db } from "@/database/drizzle";
import { evenements } from "@/database/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(request : Request) {
    const currentYear = new Date().getFullYear() ;
    const getEvenment = await db
        .select()
        .from(evenements)
        .where(
            sql`EXTRACT(YEAR FROM ${evenements.dateDebut}) = ${currentYear}`
        )
        .orderBy(desc(evenements.createdAt))
        .limit(2)
    if (getEvenment && getEvenment.length > 0) {
        return new Response(JSON.stringify(getEvenment), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } else {
        return new Response(JSON.stringify({ message: "Aucun événement trouvé" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }
}