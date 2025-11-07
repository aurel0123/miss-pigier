ALTER TABLE "admins" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "role" SET DEFAULT 'admin'::text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'subadmin', 'responsable');--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "role" SET DEFAULT 'admin'::"public"."role";--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";