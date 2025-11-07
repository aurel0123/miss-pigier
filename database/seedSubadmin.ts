import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { hash } from "bcryptjs";
import { admins } from "./schema";

config({path:".env.local"})

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const seed = async () => {
    console.log("Seeding...")

    try {
        //Donnée addmin
        const username = "subadmin";
        const email = "subadmin@pigierbenin.com" ;
        const password = "Subadmin1234" ;
        const passwordHash = await hash(password, 10)

        await db.insert(admins).values({
            username ,
            email,
            password : passwordHash,
            role : "subadmin",
        })
        console.log("Subadmin créer avec succès")
    } catch (error) {
        console.log("Erreur de seed" , error)
    }
}

seed();