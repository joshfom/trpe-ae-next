import {bigint, boolean, integer, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {propertyImagesTable} from "@/db/schema/property-images-table";
import {subCommunityTable} from "@/db/schema/sub-community-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {cityTable} from "@/db/schema/city-table";
import {propertyAmenityTable} from "@/db/schema/property-amenity-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {employeeTable} from "@/db/schema/employee-table";
import {developerTable} from "@/db/schema/developer-table";
import {createSelectSchema} from 'drizzle-zod';

export const propertyAvailability = pgEnum("property_availability", [
    "available",
    "unavailable",
    "sold",
    "rented",
    "off_market",
    "under_offer",
    "others"
]);

export const propertyStatus = pgEnum("property_status", [
    "draft",
    "published",
    "unpublished",
    "deleted",
]);

export const offplanCompletionStatus = pgEnum("property_completion_status", [
    "offplan_primary",
    "offplan_secondary",
    "ready_primary",
    "ready_secondary",
]);

export const propertyFurnished = pgEnum("property_furnished", [
    "furnished",
    "unfurnished",
    "semi_furnished",
]);

export const propertyTable = pgTable("properties", {
    id: text('id').primaryKey().notNull(),
    title: text("title"),

    name: text("name"),
    description: text("description"),
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    buildYear: text("build_year"),
    agentId: text("agent_id"),
    slug: text("slug").notNull().unique(),
    price: bigint({mode: 'number'}),
    completionStatus: text("completion_status"),
    developerId: text("developer_id"),
    communityId: text("community_id"),
    isFeatured: boolean("is_featured").default(false),
    isExclusive: boolean("is_exclusive").default(false),
    isLuxe: boolean("is_luxe").default(false),
    cityId: text("city_id"),
    offeringTypeId: text("offering_type_id"),
    unitTypeId: text("unit_type_id"),
    typeId: text("type_id"),
    longitude: text("longitude"),
    latitude: text("latitude"),
    cheques: text("cheques"),
    imported: boolean("imported").default(false),
    floor: text("floor"),
    permitNumber: text("permit_number"),
    plotSize: integer("plot_size"), // value stored in Centi Units, to retrieve divide by 100
    availabilityDate: timestamp("availability_date"),
    availability: propertyAvailability('availability').default('unavailable'),
    status: propertyStatus('status').default('draft'),
    offplanCompletionStatus: offplanCompletionStatus('offplan_completion_status'),
    furnished: text("furnished"),
    parking: text("parking"),
    referenceNumber: text("reference_number"),
    subCommunityId: text("sub_community"),
    serviceCharge: text("service_charge"),
    size: integer("size"), // value stored in Centi Units, to retrieve divide by 100
    lastUpdated: timestamp("last_updated", {withTimezone: true, mode: 'string'}), // Track when property was last updated from feed
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// Property relation
export const propertyRelation = relations(propertyTable, ({ one, many }) => ({
    agent: one(employeeTable, {
        fields: [propertyTable.agentId],
        references: [employeeTable.id],
    }),
    community: one(communityTable, {
        fields: [propertyTable.communityId],
        references: [communityTable.id],
    }),
    subCommunity: one(subCommunityTable, {
        fields: [propertyTable.subCommunityId],
        references: [subCommunityTable.id],
    }),
    city: one(cityTable, {
        fields: [propertyTable.cityId],
        references: [cityTable.id],
    }),
    offeringType: one(offeringTypeTable, {
        fields: [propertyTable.offeringTypeId],
        references: [offeringTypeTable.id],
    }),

    type: one(propertyTypeTable, {
        fields: [propertyTable.typeId],
        references: [propertyTypeTable.id],
    }),

    developer: one(developerTable, {
        fields: [propertyTable.developerId],
        references: [developerTable.id],
    }),

    amenities: many(propertyAmenityTable),
    images: many(propertyImagesTable),
}));

export const propertyTableSchema = createSelectSchema(propertyTable);
