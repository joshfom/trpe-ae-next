import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const portalsTable = pgTable("portals", {
    id: text('id').primaryKey().notNull(),
    name: text("name").notNull(),
    slug: text("url"),
    description: text("description"),
    frequency: text("frequency"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



