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
        const username = "admin"; 
        const email = "admin12@pigierbenin.com" ; 
        const password = "Admin1234" ;
        const passwordHash = await hash(password, 10) 

        await db.insert(admins).values({
            username , 
            email,
            password : passwordHash,
            role : "admin",
            is_staff : true,
        })
        console.log("Admin créer avec succès")
    } catch (error) {
        console.log("Erreur de seed" , error)
    }
}

seed(); 