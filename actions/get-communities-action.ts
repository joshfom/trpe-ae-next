"use server"
import {db} from "@/db/drizzle";


export async function getCommunitiesAction() {
    return db.query.communityTable.findMany({
        columns: {
            id: true,
            name: true,
            slug: true,
        },
    });

}