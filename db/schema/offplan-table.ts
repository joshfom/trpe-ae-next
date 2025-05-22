import {integer, pgTable, real, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {propertyImagesTable} from "@/db/schema/property-images-table";
import {subCommunityTable} from "@/db/schema/sub-community-table";
import {propertyAmenityTable} from "@/db/schema/property-amenity-table";
import {developerTable} from "@/db/schema/developer-table";
import {floorPlanTable} from "@/db/schema/floor-plan-table";
import {paymentPlanTable} from "@/db/schema/payment-plan-table";
import {offplanImagesTable} from "@/db/schema/offplan-images-table";


export const offplanTable = pgTable("offplans", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    about: text("about"),
    buildYear: text("build_year"),
    floors: integer("floors"),
    brochureUrl: text("brochure_url"),
    slug: text("slug").notNull().unique(),
    handoverDate: timestamp("handover_date"),
    fromSize: integer("from_size"),
    toSize: integer("to_size"),
    fromPrice: integer("from_price"),
    paymentTitle: text("payment_title"),
    toPrice: integer("to_price"),
    completionStatus: text("completion_status"),
    developerId: text("developer_id"),
    communityId: text("community_id"),
    qrCode: text("qr_code"),
    buildingId: text("building_id"),
    longitude: real("longitude"),
    latitude: real("latitude"),
    permitNumber: text("permit_number"),
    availabilityDate: timestamp("availability_date"),
    subCommunityId: text("sub_community"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// Offplan relation
export const offplanRelation = relations(offplanTable, ({ one, many }) => ({

    community: one(communityTable, {
        fields: [offplanTable.communityId],
        references: [communityTable.id],
    }),

    developer: one(developerTable, {
        fields: [offplanTable.developerId],
        references: [developerTable.id],
    }),


    // floorPlans: many(floorPlanTable),

    paymentPlans: many(paymentPlanTable),

    // amenities: many(propertyAmenityTable),

    images: many(offplanImagesTable),
}));

