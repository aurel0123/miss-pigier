CREATE TYPE "public"."evenement_status" AS ENUM('EN COUR', 'A VENIR', 'TERMINER');--> statement-breakpoint
CREATE TYPE "public"."status_paiement" AS ENUM('pending', 'validated', 'cancelled');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(100),
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_id_unique" UNIQUE("id"),
	CONSTRAINT "admins_username_unique" UNIQUE("username"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" varchar(100) NOT NULL,
	"prenom" varchar(100) NOT NULL,
	"filiere" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(512) NOT NULL,
	"nombreVotes" integer,
	"evenement_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "candidates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "commission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"paiement_id" uuid NOT NULL,
	"montant_total" integer NOT NULL,
	"part_site" integer NOT NULL,
	"part_organisateur" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "commission_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "evenements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titre" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(512) NOT NULL,
	"prix_unitaire_vote" integer NOT NULL,
	"date_debut" timestamp with time zone NOT NULL,
	"date_fin" timestamp with time zone NOT NULL,
	"status" "evenement_status" DEFAULT 'EN COUR',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "evenements_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "paiement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_tel" varchar(20) NOT NULL,
	"montant" integer NOT NULL,
	"status" "status_paiement" DEFAULT 'pending',
	"moyen_paiement" varchar(50),
	"fedapay_transaction_id" varchar(255),
	"evenement_id" uuid NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "paiement_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_tel" varchar(20) NOT NULL,
	"candidat_id" uuid NOT NULL,
	"paiement_id" uuid NOT NULL,
	"nombre_vote" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vote_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_evenement_id_evenements_id_fk" FOREIGN KEY ("evenement_id") REFERENCES "public"."evenements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission" ADD CONSTRAINT "commission_paiement_id_paiement_id_fk" FOREIGN KEY ("paiement_id") REFERENCES "public"."paiement"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_evenement_id_evenements_id_fk" FOREIGN KEY ("evenement_id") REFERENCES "public"."evenements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_candidat_id_candidates_id_fk" FOREIGN KEY ("candidat_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_paiement_id_paiement_id_fk" FOREIGN KEY ("paiement_id") REFERENCES "public"."paiement"("id") ON DELETE cascade ON UPDATE no action;