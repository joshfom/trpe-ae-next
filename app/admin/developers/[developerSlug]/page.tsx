import React from 'react';
import Link from "next/link";
import InsightForm from "@/features/admin/insights/components/InsightForm";
import AddDeveloperForm from "@/features/admin/developers/components/AddDeveloperForm";
import {developerTable} from "@/db/schema/developer-table";
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";


interface AddDeveloperPageProps {
    params: Promise<{
        developerSlug: string
    }>
}
async function AddDeveloperPage(props: AddDeveloperPageProps) {
    const params = await props.params;

    const slug = params.developerSlug

    const developer = await db.query.developerTable.findFirst({
        where:
            eq(developerTable.slug, slug)
    }) as unknown as DeveloperType

    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">{ developer.name}</div>
                </div>

                <div className="items-center  space-x-4">
                    <Link
                        href={`/admin/developers/${developer.slug}/edit`}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Edit Developer
                    </Link>
                </div>
            </div>

            <div>
                {/*<AddDeveloperForm/>*/}
            </div>

        </div>
    );
}

export default AddDeveloperPage;