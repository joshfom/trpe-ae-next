import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";


export const offerTypeTable = pgTable("offer_types", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    short_name: text("short_name"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

//offering type relation
export const offeringTypeRelation = relations(offerTypeTable, ({one, many}) => ({
    properties: many(propertyTable)
}));



