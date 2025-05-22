import {integer, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {offplanTable} from "@/db/schema/offplan-table";


export const offplanImagesTable = pgTable("offplan_images", {
    id: text('id').primaryKey().notNull(),
    offplanId: text("offplan_id"),
    url: text("url"),
    order: integer("order").default(0),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

//offplan images relation
export const offplanImagesRelation = relations(offplanImagesTable, ({ one, many }) => ({
    offplan: one(offplanTable, {
        fields: [offplanImagesTable.offplanId],
        references: [offplanTable.id],
    }),
}) )



