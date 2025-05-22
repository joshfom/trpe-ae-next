"use server";

import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { desc, eq, or, ilike, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function getAllRedirectsAction(page = 1, pageSize = 10, search = "") {
    const offset = (page - 1) * pageSize;

    let query = db.select().from(redirectTable);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(redirectTable);

    if (search) {
        const searchCondition = or(
            ilike(redirectTable.fromUrl, `%${search}%`),
            ilike(redirectTable.toUrl, `%${search}%`)
        );
      query = query.where(searchCondition) as typeof query;
      countQuery = countQuery.where(searchCondition) as typeof countQuery;
    }

    const totalCountResult = await countQuery;
    const totalCount = Number(totalCountResult[0].count);

    const redirects = await query
        .orderBy(desc(redirectTable.createdAt))
        .limit(pageSize)
        .offset(offset);

    return {
        redirects,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
        totalCount,
    };
}