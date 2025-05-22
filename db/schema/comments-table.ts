import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const commentsTable = pgTable("comments", {
    id: text('id').primaryKey().notNull(),
    content: text("content").notNull(),
    commentableId: text("commentable_id"),
    commentableType: text("commentable_type"),
    userId: text("user_id"),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



