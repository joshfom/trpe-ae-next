import {integer, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {offplanTable} from "@/db/schema/offplan-table";


export const developerTable = pgTable("developers", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    logoUrl: text("logo_url"),
    order: integer("order").default(100),
    short_name: text("short_name"),
    website: text("website"),
    featuredImage: text("featured_image"),
    about: text("about"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});


export const developerRelation = relations(developerTable, ({ many}) => ({
    properties: many(propertyTable),
    offplans: many(offplanTable),
}));


