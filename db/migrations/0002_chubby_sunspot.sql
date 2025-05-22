ALTER TABLE "employees" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "type" SET DEFAULT 'agent';--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "offering" bigint;--> statement-breakpoint
DROP TYPE "public"."employee_type";