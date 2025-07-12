CREATE TYPE "public"."status" AS ENUM('EN COUR', 'A VENIR', 'TERMINER');--> statement-breakpoint
CREATE TABLE "evenements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titre" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(512) NOT NULL,
	"prix_unitaire_vote" integer NOT NULL,
	"date_debut" timestamp with time zone NOT NULL,
	"date_fin" timestamp with time zone NOT NULL,
	"status" "status" DEFAULT 'EN COUR',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "evenements_id_unique" UNIQUE("id")
);
