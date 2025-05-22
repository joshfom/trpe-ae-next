import {integer, jsonb, pgTable, real, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {offplanTable} from "@/db/schema/offplan-table";


export const paymentPlanTable = pgTable("payment_plans", {
    id: text('id').primaryKey().notNull(),
    offplanId: text("offplan_id"),
    title: text("title"),
    percentage: integer("percentage"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// PaymentPlan relation
export const paymentPlanRelation = relations(paymentPlanTable, ({ one, many }) => ({
    offplan: one(offplanTable, {
        fields: [paymentPlanTable.offplanId],
        references: [offplanTable.id],
    }),
}));