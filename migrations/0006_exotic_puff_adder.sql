CREATE TYPE "public"."status_retrait" AS ENUM('en cour', 'approuver', 'completer', 'rejecter');--> statement-breakpoint
CREATE TABLE "retray" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"montant_retrait" integer,
	"status" "status_retrait",
	"telephone" integer,
	"user_id" uuid,
	"date_creation" timestamp DEFAULT now(),
	"date_aprobation" timestamp DEFAULT now(),
	CONSTRAINT "retray_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "retray" ADD CONSTRAINT "retray_user_id_admins_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;