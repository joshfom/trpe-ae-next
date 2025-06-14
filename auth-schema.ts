import {boolean, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at'),
    username: text('username').unique(),
    displayUsername: text('display_username'),
    phoneNumber: text('phone_number').unique(),
    phoneNumberVerified: boolean('phone_number_verified'),
    twoFactorEnabled: boolean('two_factor_enabled'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    timezone: text('timezone')
});

export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => users.id, {onDelete: 'cascade'})
});

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verifications = pgTable("verifications", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const twoFactors = pgTable("two_factors", {
    id: text("id").primaryKey(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id').notNull().references(() => users.id, {onDelete: 'cascade'})
});



//Relations
export const userRelation = relations(users, ({many}) => ({
    sessions: many(sessions),
    accounts: many(accounts),
    verifications: many(verifications),
    twoFactors: many(twoFactors)
}));


