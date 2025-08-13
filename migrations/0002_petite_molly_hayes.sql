CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" varchar(100) NOT NULL,
	"prenom" varchar(100) NOT NULL,
	"filiere" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(512) NOT NULL,
	"evenement_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "candidates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_evenement_id_evenements_id_fk" FOREIGN KEY ("evenement_id") REFERENCES "public"."evenements"("id") ON DELETE no action ON UPDATE no action;