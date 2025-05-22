import {boolean, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const propertyOwnersTable = pgTable("property_owners", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    email: text("email"),
    buildingName: text("building_name"),
    phone: text("phone"),
    address: text("address"),
    mobile: text("mobile"),
    residentCountry: text("resident_country"),
    secondaryMobile: text("secondary_mobile"),
    nationality: text("nationality"),
    addedBy: text("addedBy"),
    updatedBy: text("updated_by"),
    secondaryPhone: text("secondary_phone"),
    areaOwned: text("area_owned"),
    plotNumber: text("plot_number"),
    totalArea: text("total_area"),
    usageType: text("usage_type"),
    project: text("project"),
    masterProject: text("master_project"),
    municipalityNumber: text("municipality_number"),
    commonArea: text("common_area"),
    parkingArea: text("parking_area"),
    balconyArea: text("balcony_area"),
    unitNumber: text("unit_number"),
    registrationNumber: text("registration_number"),
    procedureNumber: text("procedure_number"),
    size  : text("size"),
    roomType: text("room_type"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



