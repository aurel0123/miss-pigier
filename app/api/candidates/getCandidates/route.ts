"use server"
import { db } from "@/database/drizzle";
import { candidates } from "@/database/schema";

export async function GET() {
    const getcandidates = await db
        .select()
        .from(candidates)

    if (getcandidates && getcandidates.length > 0) {
        return new Response(JSON.stringify(getcandidates), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } else {
        return new Response(JSON.stringify({ message: "Aucune candidates trouvé" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }
}