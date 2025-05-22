import {integer, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {offplanTable} from "@/db/schema/offplan-table";


export const floorPlanTable = pgTable("floor_plans", {
    id: text('id').primaryKey().notNull(),
    propertyId: text("property_id"),
    url: text("url"),
    order: integer("order").default(0),
    fileType: text("file_type").default("image"),
    name: text("name"),
    type: text("type"),
    bedrooms: integer("bedrooms"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// FloorPlan relation
export const floorPlanRelation = relations(floorPlanTable, ({ one, many }) => ({
    property: one(offplanTable, {
        fields: [floorPlanTable.propertyId],
        references: [offplanTable.id],
    }),
}));


