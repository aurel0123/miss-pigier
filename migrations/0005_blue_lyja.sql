CREATE TYPE "public"."category_notification" AS ENUM('user', 'payment', 'vote', 'system');--> statement-breakpoint
CREATE TYPE "public"."type_notification" AS ENUM('withdrawal_request', 'withdrawal_approved', 'withdrawal_rejected', 'payment_completed');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "category_notification",
	"type" "type_notification",
	"title" varchar,
	"message" varchar,
	"user_id" uuid,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "notification_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_admins_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;