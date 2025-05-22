import {boolean, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const contactTable = pgTable("contacts", {
    id: text('id').primaryKey().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    mobile: text("mobile"),
    imported: boolean("imported").default(false),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
    assignedTo: text("assigned_to"),
    secondaryPhone: text("secondary_phone"),
    residence: text("residence"),
    nationality: text("national"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



