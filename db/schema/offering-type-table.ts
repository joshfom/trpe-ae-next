import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';


export const offeringTypeTable = pgTable("offering_types", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    metaTitle: text("meta_title"),
    metaDesc: text("meta_description"),
    pageTitle: text("page_title"),
    about: text("about"),
    short_name: text("short_name"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// Create Zod schemas for the offering type table
export const offeringTypeSelectSchema = createSelectSchema(offeringTypeTable);
export const offeringTypeInsertSchema = createInsertSchema(offeringTypeTable);
export const offeringTypeUpdateSchema = createUpdateSchema(offeringTypeTable);

// Export type definitions derived from the table
export type OfferingTypeSelect = typeof offeringTypeTable.$inferSelect;
export type OfferingTypeInsert = typeof offeringTypeTable.$inferInsert;
export type OfferingTypeUpdate = Partial<OfferingTypeInsert>;

export const offeringTypeRelations = relations(offeringTypeTable, ({ one, many }) => ({
    properties: many(propertyTable),
}));

