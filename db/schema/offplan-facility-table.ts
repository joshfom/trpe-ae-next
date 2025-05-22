import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {amenityTable} from "@/db/schema/amenity-table";

export const offplanFacilityTable = pgTable("offplan_facilities", {
    id: text('id').primaryKey().notNull(),
    offplanId: text("offplan_id"),
    facilityId: text("facility_id"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

