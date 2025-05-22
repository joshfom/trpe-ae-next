import {jsonb, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";

export const mediaTable = pgTable("media", {
    id: text('id').primaryKey().notNull(),
    modelId: text("model_id").notNull(),
    modelType: text("model_type").notNull(),
    name: text("name").notNull(),
    fileName: text("file_name").notNull(),
    url: text("url").notNull(),
    disk: text("disk"),
    collectionName: text("collection_name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: text("size").notNull(),
    manipulations: jsonb("manipulations"),
    customProperties: jsonb("custom_properties"),
    responsiveImages: jsonb("responsive_images"),
    orderColumn: text("order_column"),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
});