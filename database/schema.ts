import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const STATUS_EVENEMENT = pgEnum("evenement_status" , [
    "EN COUR",
    "A VENIR",
    "TERMINER",
])
export const STATUS_PAIEMENT = pgEnum("status_paiement" , [
    "pending", 
    "validated", 
    "cancelled"
])
export const evenements = pgTable("evenements", {
    id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
    titre : varchar("titre", {length : 255}).notNull(), 
    description: text("description").notNull(),
    image: varchar("image", { length: 512 }).notNull(),
    prixUnitaireVote: integer("prix_unitaire_vote").notNull(),
    dateDebut: timestamp("date_debut", { withTimezone: true }).notNull(),
    dateFin: timestamp("date_fin", { withTimezone: true }).notNull(),
    status : STATUS_EVENEMENT("status").default("EN COUR"),
    createdAt: timestamp("created_at").defaultNow(),
})

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email : varchar("email" , {length : 100}).unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  nom: varchar("nom", { length: 100 }).notNull(),
  prenom: varchar("prenom", { length: 100 }).notNull(), 
  filiere: varchar("filiere", { length: 255 }).notNull(), 
  description: text("description"), 
  image: varchar("image", { length: 512 }).notNull(),
  nombreVotes : integer("nombreVotes"),
  evenementId: uuid("evenement_id").notNull().references(() => evenements.id),
  createdAt: timestamp("created_at").defaultNow(), 
});

export const paiements = pgTable("paiement", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  numeroTel: varchar("numero_tel", { length: 20 }).notNull(),
  montant: integer("montant").notNull(),
  status: STATUS_PAIEMENT("status").default("pending"), 
  moyenPaiement: varchar("moyen_paiement", { length: 50 }), // Ajouté
  fedapayTransactionId: varchar("fedapay_transaction_id", { length: 255 }), // Ajouté
  evenementId: uuid("evenement_id")
  .notNull()
  .references(() => evenements.id, { onDelete: "cascade" }),
  metadata: jsonb("metadata"), // Ajouté pour stocker les données supplémentaires
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const votes = pgTable("vote", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  numeroTel: varchar("numero_tel", { length: 20 }).notNull(),
  candidatId: uuid("candidat_id") // ✅ Corrigé ici
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  paiementId: uuid("paiement_id")
    .notNull()
    .references(() => paiements.id, { onDelete: "cascade" }),
  nombreVote: integer("nombre_vote").notNull().default(1),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const commissions = pgTable("commission", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  paiementId: uuid("paiement_id") // Changé de integer à uuid
    .notNull()
    .references(() => paiements.id, { onDelete: "cascade" }),
  montantTotal: integer("montant_total").notNull(),
  partSite: integer("part_site").notNull(),
  partOrganisateur: integer("part_organisateur").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});