import {integer, jsonb, pgTable, real, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";


export const authorTable = pgTable("authors", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    about: text("about"),
    avatar: text("avatar"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});


