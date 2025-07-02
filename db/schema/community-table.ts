import {boolean, integer, jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {createInsertSchema, createSelectSchema, createUpdateSchema} from "drizzle-zod";
import {cityTable} from "@/db/schema/city-table";

/**
 * Community database table schema
 * Represents a community/neighborhood entity with its properties and relationships
 *
 * @table communities
 * @relations
 * - One-to-many with properties
 * - Many-to-one with city
 */
export const communityTable = pgTable("communities", {
    /** Unique identifier for the community */
    id: text('id').primaryKey().notNull(),
    /** Full name of the community */
    name: text("name"),
    /** Visibility status of the community */
    isPublic: boolean("is_public").default(true),
    /** Meta description for SEO */
    metaDesc: text("meta_desc"),
    /** Meta title for SEO */
    metaTitle: text("meta_title"),
    /** Meta keywords for SEO */
    metaKeywords: text("meta_keywords"),
    /** Detailed description of the community */
    about: text("about"),
    /** Reference to the city this community belongs to */
    cityId: text("city_id"),
    /** Display label for the community */
    label: text("label"),
    /** Geographic longitude */
    longitude: text("longitude"),
    /** Geographic latitude */
    latitude: text("latitude"),
    /** URL to the community's image */
    image: text("image"),
    /** Abbreviated name of the community */
    shortName: text("short_name"),
    /** URL-friendly unique identifier */
    slug: text("slug").notNull().unique(),
    /** Whether this community is featured on homepage */
    featured: boolean("featured").default(false),
    /** Display order for featured communities (lower numbers appear first) */
    displayOrder: integer("display_order").default(0),
    /** Whether this community is available in Luxe section */
    isLuxe: boolean("is_luxe").default(false),
    /** Luxe-specific name */
    luxeName: text("luxe_name"),
    /** Luxe-specific meta title for SEO */
    luxeMetaTitle: text("luxe_meta_title"),
    /** Luxe-specific meta description for SEO */
    luxeMetaDesc: text("luxe_meta_desc"),
    /** Luxe-specific about content (rich text) */
    luxeAbout: text("luxe_about"),
    /** URL to the luxe community's main image */
    luxeImageUrl: text("luxe_image_url"),
    /** URL to the luxe community's hero image */
    luxeHeroImageUrl: text("luxe_hero_image_url"),
    /** Whether this luxe community is featured */
    luxeFeatured: boolean("luxe_featured").default(false),
    /** Display order for luxe communities (lower numbers appear first) */
    luxeDisplayOrder: integer("luxe_display_order").default(0),
    /** Last update timestamp */
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    /** Creation timestamp */
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

/** Zod schema for community creation */
export const communityCreateSchema = createInsertSchema(communityTable);
/** Zod schema for community selection */
export const communitySelectSchema = createSelectSchema(communityTable);
/** Zod schema for community updates */
export const communityUpdateSchema = createUpdateSchema(communityTable);

// Export type definitions derived from the schemas
export type CommunitySelect = typeof communitySelectSchema._type;
export type CommunityInsert = typeof communityCreateSchema._type;
export type CommunityUpdate = typeof communityUpdateSchema._type;

/**
 * Community table relationships
 * - properties: One-to-many relationship with properties
 * - city: Many-to-one relationship with city
 */
export const communityRelation = relations(communityTable, ({ one, many }) => ({
    properties: many(propertyTable),
    city: one(cityTable, {
        fields: [communityTable.cityId],
        references: [cityTable.id],
    }),
}));