import {boolean, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";

export const pageMetaTable = pgTable("page_metas", {
    id: text('id').primaryKey().notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    noIndex: boolean("no_index"),
    noFollow: boolean("no_follow"),
    includeInSitemap: boolean("include_in_sitemap"),
    metaKeywords: text("meta_keywords"),
    title: text("title"),
    content: text("content"),
    path: text("path").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

export const pageMetaRelation = relations(pageMetaTable, ({ }) => ({}));
