import {integer, jsonb, pgTable, real, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";






export const faqTable = pgTable("faqs", {
    id: text('id').primaryKey().notNull(),
    question: text("question"),
    imageUrl: text("image_url"),
    answer: text("answer"),
    targetId: text("target_id"),
    targetModel: text("target_model"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});


