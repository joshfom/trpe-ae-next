import {boolean, integer, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {createInsertSchema} from "drizzle-zod";
import {teamTable} from "@/db/schema/team-table";


export const employeeTable = pgTable("employees", {
    id: text('id').primaryKey().notNull(),
    firstName: text("first_name"),
    slug: text("slug").notNull().unique(),
    title: text("title"),
    lastName: text("last_name"),
    order: integer("order").default(100),
    type: text("type").default('agent'),
    isVisible: boolean("is_visible").default(false),
    userId: text("user_id"),
    avatarUrl: text("avatar_url"),
    isActive: text("is_active").default('false'),
    teamId: text("team_id"),
    bio: text("bio"),
    rera: text("rera"),
    phone: text("phone"),
    email: text("email"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

//agents relation
export const employeeRelation = relations(employeeTable, ({many, one}) => ({
    properties: many(propertyTable),
    team: one(teamTable, {
        fields: [employeeTable.teamId],
        references: [teamTable.id]
    })
}));


export const employeeCreateSchema = createInsertSchema(employeeTable);


