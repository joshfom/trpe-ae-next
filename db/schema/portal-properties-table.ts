import {integer, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {portalsTable} from "@/db/schema/portals-table";


export const portalPropertyTable = pgTable("portal_properties", {
    id: text('id').primaryKey().notNull(),
    propertyId: text("property_id"),
    portalId: text("portal_id"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

//property images relation
export const portalPropertyRelation = relations(portalPropertyTable, ({ one, many }) => ({
    property: one(propertyTable, {
        fields: [portalPropertyTable.propertyId],
        references: [propertyTable.id],
    }),

    portal: one(portalsTable, {
        fields: [portalPropertyTable.portalId],
        references: [portalsTable.id],
    }),
}) )



