import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const leadTable = pgTable("leads", {
    id: text('id').primaryKey().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone").notNull().unique(),
    message: text("message"),
    source: text("source"),
    propertyId: text("property_id"),
    agentId: text("agent_id"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});




