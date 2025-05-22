ALTER TABLE "page_metas" ADD COLUMN "no_index" boolean;--> statement-breakpoint
ALTER TABLE "page_metas" ADD COLUMN "no_follow" boolean;--> statement-breakpoint
ALTER TABLE "page_metas" ADD COLUMN "include_in_sitemap" boolean;--> statement-breakpoint
ALTER TABLE "page_metas" ADD COLUMN "meta_keywords" text;