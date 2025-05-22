import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const cityTable = pgTable("cities", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    longitude: text("longitude"),
    latitude: text("latitude"),
    countryId: text("country_id"),
    short_name: text("short_name"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



