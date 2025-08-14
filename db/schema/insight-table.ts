import {boolean, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {sql, relations} from "drizzle-orm";
import {createInsertSchema} from "drizzle-zod";
import {authorTable} from "@/db/schema/author-table";
import {employeeTable} from "@/db/schema/employee-table";


export const insightTable = pgTable("insights", {
    id: text('id').primaryKey().notNull(),
    title: text("title"),
    coverUrl: text("cover_url"),
    authorId: text("author"),
    aboutAuthor: text("about_author"),
    communityId: text("community_id"),
    subCommunityId: text("sub_community_id"),
    altText: text("alt_text"),
    metaDescription: text("meta_description"),
    metaTitle: text("meta_title"),
    cityId: text("city_id"),
    developerId: text("developer_id"),
    content: text("content"),
    developmentId: text("development_id"),
    isPublished: text("is_published"),
    isLuxe: boolean("is_luxe").default(false),
    publishedAt: timestamp("published_at", {withTimezone: true, mode: 'string'}),
    agentId: text("agent_id"),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});

// Insight relations
export const insightRelation = relations(insightTable, ({one}) => ({
    author: one(authorTable, {
        fields: [insightTable.authorId],
        references: [authorTable.id]
    }),
    agent: one(employeeTable, {
        fields: [insightTable.agentId],
        references: [employeeTable.id]
    })
}));

export const insightCreateSchema = createInsertSchema(insightTable)



