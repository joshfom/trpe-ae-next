ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "display_order" integer DEFAULT 0;