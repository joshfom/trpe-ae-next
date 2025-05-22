import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const activityTable = pgTable("activities", {
    id: text('id').primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    modelId: text("model_id"),
    modelType: text("model_type"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



