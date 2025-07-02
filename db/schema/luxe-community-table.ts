import {boolean, integer, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {createId} from "@paralleldrive/cuid2";
import {communityTable} from "./community-table";

export const luxeCommunityTable = pgTable("luxe_communities", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    communityId: text("community_id").references(() => communityTable.id).notNull(),
    
    // Luxe-specific content fields
    name: text("name").notNull(),
    metaTitle: text("meta_title"),
    metaDesc: text("meta_desc"),
    about: text("about"),
    image: text("image"),
    heroImage: text("hero_image"),
    
    // Display settings
    featured: boolean("featured").default(false),
    displayOrder: integer("display_order").default(0),
    
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type LuxeCommunity = typeof luxeCommunityTable.$inferSelect;
export type InsertLuxeCommunity = typeof luxeCommunityTable.$inferInsert;
