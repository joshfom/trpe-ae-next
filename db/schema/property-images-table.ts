import {integer, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';


export const propertyImagesTable = pgTable("property_images", {
    id: text('id').primaryKey().notNull(),
    propertyId: text("property_id"),
    crmUrl: text("crm_url"),
    s3Url: text("s3_url"), // URL to the WebP image in S3
    order: integer("order").default(0),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

//property images relation
export const propertyImagesRelation = relations(propertyImagesTable, ({ one, many }) => ({
    property: one(propertyTable, {
        fields: [propertyImagesTable.propertyId],
        references: [propertyTable.id],
    }),
}) );

// Create Zod schemas for the property images table
export const propertyImagesSelectSchema = createSelectSchema(propertyImagesTable);
export const propertyImagesInsertSchema = createInsertSchema(propertyImagesTable);
export const propertyImagesUpdateSchema = createUpdateSchema(propertyImagesTable);

// Export type definitions derived from the schemas
export type PropertyImagesSelect = typeof propertyImagesSelectSchema._type;
export type PropertyImagesInsert = typeof propertyImagesInsertSchema._type;
export type PropertyImagesUpdate = typeof propertyImagesUpdateSchema._type;



