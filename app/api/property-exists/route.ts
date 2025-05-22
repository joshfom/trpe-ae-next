import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/db/drizzle";
import { propertyTable } from "@/db/schema/property-table";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ exists: false }, { status: 400 });
    }

    try {
        // Check if property exists in database
        const property = await db.query.propertyTable.findFirst({
            where: eq(propertyTable.slug, slug),
            columns: { id: true }
        });

        console.log('Property exists check for slug:', slug, 'Result:', !!property);

        return NextResponse.json({ exists: !!property }, { status: 200 });
    } catch (error) {
        console.error('Database error checking property:', error);
        return NextResponse.json({ exists: false, error: 'Database error' }, { status: 500 });
    }
}