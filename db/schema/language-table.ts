import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";
import {createInsertSchema} from "drizzle-zod";

export const languageTable = pgTable("languages", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    icon: text("icon"),
    slug: text("slug").notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

export const languageInsertSchema = createInsertSchema(languageTable);