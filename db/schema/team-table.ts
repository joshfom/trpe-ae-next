import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {employeeTable} from "@/db/schema/employee-table";


export const teamTable = pgTable("teams", {
    id: text('id').primaryKey().notNull(),
    name: text("name").notNull(),
    leaderId: text("leader_id").references(() => employeeTable.id),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

export const teamTableRelation = relations(teamTable, ({one, many}) => ({
    members: many(teamTable),
    leader: one(employeeTable, {
        fields: [teamTable.leaderId],
        references: [employeeTable.id]
    })

}));



