import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';

export const unitTypeTable = pgTable("unit_types", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    short_name: text("short_name"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// Create Zod schemas for the unit type table
export const unitTypeSelectSchema = createSelectSchema(unitTypeTable);
export const unitTypeInsertSchema = createInsertSchema(unitTypeTable);
export const unitTypeUpdateSchema = createUpdateSchema(unitTypeTable);

// Export type definitions derived from the table
export type UnitTypeSelect = typeof unitTypeTable.$inferSelect;
export type UnitTypeInsert = typeof unitTypeTable.$inferInsert;
export type UnitTypeUpdate = Partial<UnitTypeInsert>;

export const unitTypeRelations = relations(unitTypeTable, ({ many }) => ({
    properties: many(propertyTable),
}));