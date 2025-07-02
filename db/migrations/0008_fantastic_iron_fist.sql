ALTER TABLE "communities" ADD COLUMN "is_luxe" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_meta_title" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_title" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_description" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_image_url" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "luxe_hero_image_url" text;