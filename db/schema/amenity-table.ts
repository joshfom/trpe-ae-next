import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {createInsertSchema} from "drizzle-zod";
import {propertyAmenityTable} from "@/db/schema/property-amenity-table";

export const amenityTable = pgTable("amenities", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    slug: text("slug"),
    icon: text("icon"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});


// Amenity relation
export const amenityRelation = relations(amenityTable, ({ many }) => ({
    properties: many(propertyAmenityTable),
}));




