import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const developmentTable = pgTable("developments", {
    id: text('id').primaryKey().notNull(),
    title: text("title"),
    description: text("description"),
    bedrooms: text("bedrooms"),
    bathrooms: text("bathrooms"),
    buildYear: text("build_year"),
    slug: text("slug").notNull().unique(),
    price: text("price"),
    completionStatus: text("completion_status"),
    developerId: text("developer_id"),
    communityId: text("community_id"),
    cityId: text("city_id"),
    offeringTypeId: text("offering_type_id"),
    propertyTypeId: text("property_type_id"),
    longitude: text("longitude"),
    latitude: text("latitude"),
    cheques: text("cheques"),
    floor: text("floor"),
    availabilityDate: timestamp("availability_date"),
    parking: text("parking"),
    furnished: text("furnished"),
    referenceNumber: text("reference_number"),
    subCommunity: text("sub_community"),
    serviceCharge: text("service_charge"),
    size: text("size"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



