CREATE TABLE "luxe_communities" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"name" text NOT NULL,
	"meta_title" text,
	"meta_desc" text,
	"about" text,
	"image" text,
	"hero_image" text,
	"featured" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_name" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_meta_desc" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_about" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_display_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "is_luxe" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "insights" ADD COLUMN "is_luxe" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "is_luxe" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "luxe_communities" ADD CONSTRAINT "luxe_communities_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" DROP COLUMN "luxe_title";--> statement-breakpoint
ALTER TABLE "communities" DROP COLUMN "luxe_description";