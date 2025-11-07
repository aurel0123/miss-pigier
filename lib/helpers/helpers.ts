import { db } from "@/database/drizzle";
import {admins, evenements} from "@/database/schema";
import { eq , or } from 'drizzle-orm'


export async function determinePublishStatus(): Promise<boolean> {
    const publishedEvent = await db
        .select()
        .from(evenements)
        .where(eq(evenements.publish,true));

    // Si un événement publié existe, le nouveau sera false
    return publishedEvent.length === 0;
}

export async function setPublishEvent(eventId: string) {
    // Mettre tous les événements à false
    await db.update(evenements).set({ publish: false });

    // Mettre celui choisi à true
    const updatedEvent = await db
        .update(evenements)
        .set({ publish: true })
        .where(eq(evenements.id,eventId))
        .returning();

    return updatedEvent[0];
}

export async function  getUsers() {
    const allUsers = await db
        .select()
        .from(admins)
        .where(
            or(
                eq(admins.role, 'subadmin'),
                eq(admins.role, 'responsable')
            )
        )

    return allUsers
}