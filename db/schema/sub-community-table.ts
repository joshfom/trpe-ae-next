import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const subCommunityTable = pgTable("sub_communities", {
    id: text('id').primaryKey().notNull(),
    name: text("name"),
    label: text("label"),
    communityId: text("community_id"),
    longitude: text("longitude"),
    latitude: text("latitude"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



