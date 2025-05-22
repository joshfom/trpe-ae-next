import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {amenityTable} from "@/db/schema/amenity-table";

export const propertyAmenityTable = pgTable("property_amenities", {
    id: text('id').primaryKey().notNull(),
    propertyId: text("property_id").notNull(),
    icon: text("icon"),
    amenityId: text("amenity_id").notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});


// Property Amenity relation
export const propertyAmenityRelation = relations(propertyAmenityTable, ({ one }) => ({

    property: one(propertyTable, {
        fields: [propertyAmenityTable.propertyId],
        references: [propertyTable.id],
    }),
    amenity: one(amenityTable, {
        fields: [propertyAmenityTable.amenityId],
        references: [amenityTable.id],
    }),
}));