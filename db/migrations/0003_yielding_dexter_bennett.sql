ALTER TABLE "properties" ALTER COLUMN "price" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "sold" text;--> statement-breakpoint
ALTER TABLE "properties" DROP COLUMN "offering";