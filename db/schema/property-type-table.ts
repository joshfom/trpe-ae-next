import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';


export const propertyTypeTable = pgTable("property_types", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    rentMetaTitle: text("rent_meta_title"),
    rentMetaDescription: text("rent_meta_description"),
    saleMetaTitle: text("sale_meta_title"),
    saleMetaDescription: text("sale_meta_description"),
    saleContent: jsonb("sale_content"),
    rentContent: jsonb("rent_content"),
    rentH1: text("rent_h1"),
    saleH1: text("sale_h1"),
    short_name: text("short_name"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// Create Zod schemas for the property type table
export const propertyTypeSelectSchema = createSelectSchema(propertyTypeTable);
export const propertyTypeInsertSchema = createInsertSchema(propertyTypeTable);
export const propertyTypeUpdateSchema = createUpdateSchema(propertyTypeTable);

// Export type definitions derived from the schemas
export type PropertyTypeSelect = typeof propertyTypeSelectSchema._type;
export type PropertyTypeInsert = typeof propertyTypeInsertSchema._type;
export type PropertyTypeUpdate = typeof propertyTypeUpdateSchema._type;



