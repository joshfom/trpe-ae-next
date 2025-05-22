CREATE TABLE "page_metas" (
	"id" text PRIMARY KEY NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"title" text,
	"content" text,
	"path" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_metas_path_unique" UNIQUE("path")
);
--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "is_exclusive" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "properties" DROP COLUMN "sold";