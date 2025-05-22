import {integer, jsonb, pgTable, real, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";


export const buildingsTable = pgTable("buildings", {
    id: text('id').primaryKey().notNull(),
    propertyId: text("property_id"),
    name: text("name"),
    type: text("type"),
    about: text("about"),
    bedrooms: integer("bedrooms"),
    longitudes: real("longitudes"),
    latitudes: real("latitudes"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});


