import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const STATUS_EVENEMENT = pgEnum("status" , [
    "EN COUR",
    "A VENIR",
    "TERMINER",
])

export const evenements = pgTable("evenements", {
    id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
    titre : varchar("titre", {length : 255}).notNull(), 
    description: text("description").notNull(),
    image: varchar("image", { length: 512 }).notNull(),
    prixUnitaireVote: integer("prix_unitaire_vote").notNull(),
    dateDebut: timestamp("date_debut", { withTimezone: true }).notNull(),
    dateFin: timestamp("date_fin", { withTimezone: true }).notNull(),
    satus : STATUS_EVENEMENT("status").default("EN COUR"),
    createdAt: timestamp("created_at").defaultNow(),
})

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email : varchar("email" , {length : 100}).unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});