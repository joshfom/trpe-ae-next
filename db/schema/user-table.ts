import {boolean, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";



export const userTable = pgTable("users", {
    id: text('id').primaryKey().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    avatarUrl: text("avatar_url"),
    username: text("username"),
    isActive: boolean("is_active").default(false),
    password: text("password"),
    googleId: text("google_id"),
    githubId: text("github_id"),
    verifiedAt: timestamp("verified_at", {withTimezone: true, mode: 'string'}),
    email: text("email").unique().notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});

