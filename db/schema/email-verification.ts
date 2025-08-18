import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";
import {users} from "./auth-schema";


export const emailVerificationTable = pgTable("email_verifications", {
    id: text('id').primaryKey().notNull(),
    email: text("email").notNull().unique(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", {withTimezone: true, mode: 'date'}).notNull(),
    userId: text("user_id").notNull().references(() => users.id),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



