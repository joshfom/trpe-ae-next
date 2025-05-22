import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";

export const agentLanguageTable = pgTable("agent_languages", {
    id: text('id').primaryKey().notNull(),
    agentId: text("agentId").notNull(),
    languageId: text("languageId").notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});
