import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const redirectTable = pgTable("redirects", {
    id: text('id').primaryKey().notNull(),
    fromUrl: text("from_url").notNull().unique(),
    toUrl: text("to_url"),
    statusCode: text("status_code").notNull(), // "301" or "410"
    isActive: text("is_active").default("yes"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

export const redirectCreateSchema = createInsertSchema(redirectTable);