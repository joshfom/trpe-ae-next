import {boolean, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const assignedOwnersTable = pgTable("assigned_owners", {
    id: text('id').primaryKey().notNull(),
    agentId: text("agent_id"),
    propertyOwnerId: text("property_owner_id"),
    name: text("name"),
    address: text("address"),
    mobile: text("mobile"),
    residentCountry: text("resident_country"),
    secondaryMobile: text("secondary_mobile"),
    nationality: text("national"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
    assignedTo: text("assigned_to"),
    secondaryPhone: text("secondary_phone"),
    areaOwned: text("area_owned"),
    plotNumber: text("plot_number"),
    totalArea: text("total_area"),
    usageType: text("usage_type"),
    project: text("project"),
    masterProject: text("master_project"),
    municipalityNumber: text("municipality_number"),
    floors: text("floors"),
    commonArea: text("common_area"),
    parkingArea: text("parking_area"),
    balconyArea: text("balcony_area"),
    flatNumber: text("flat_number"),
    registrationNumber: text("registration_number"),
    buildingName: text("building_name"),
    area  : text("area"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



