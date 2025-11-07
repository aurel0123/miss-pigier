CREATE TYPE "public"."role" AS ENUM('admin', 'subadmin', 'Responsable');--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "role" "role" DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "is_active" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "is_staff" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "evenements" ADD COLUMN "publish" boolean DEFAULT false;