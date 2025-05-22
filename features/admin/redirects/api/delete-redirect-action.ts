"use server";

import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteRedirectAction(id: string) {
    try {
        await db.delete(redirectTable)
            .where(eq(redirectTable.id, id));

        revalidatePath("/admin/redirects");
        return { success: true, message: "Redirect deleted successfully" };
    } catch (error) {
        console.error("Error deleting redirect:", error);
        return { success: false, message: "Failed to delete redirect" };
    }
}