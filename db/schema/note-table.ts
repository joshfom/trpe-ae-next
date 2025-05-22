import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const noteTable = pgTable("notes", {
    id: text('id').primaryKey().notNull(),
    title: text("title"),
    content: text("content"),
    userId: text("user_id"),
    notetableId: text("notetable_id"),
    notetableType: text("notetable_type"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



