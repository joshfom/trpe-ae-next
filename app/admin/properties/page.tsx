import {db} from "@/db/drizzle";
import ImportListing from "@/features/admin/listings/components/ImportListing";
import Link from "next/link";
import Image from "next/image";
import { PropertyType } from "@/types/property";


async function AdminPropertyPage() {

    const properties = await db.query.propertyTable.findMany({
        with: {
            community: true,
            subCommunity: true,
            agent: true,
            city: true,
            offeringType: true,
            images: true,
        },
        limit: 12,
    }) as unknown as PropertyType[];





    return (
        <div className={'w-full'}>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Properties </div>
                </div>

                <div className="items-center flex   space-x-4">
                    <Link className={'py-2 px-6 rounded-xl border'} href={'/admin/properties/create'}>
                        New Property
                    </Link>
                    <ImportListing />
                </div>
            </div>


            {
                properties.length === 0 && (
                    <div className={' flex-1 mt-4 flex flex-col items-center space-y-8 justify-center h-96'}>
                        <p>You have not created any properties yet.</p>
                    </div>
                )
            }

            {
                 properties?.length > 0 && (
                    <div className="mt-6 grid grid-cols-4 gap-6">
                        {properties.map((property: any) => (
                            <div className="bg-white rounded flex flex-col justify-between" key={property.id}>
                                <div className="flex flex-col">
                                    <div className={'relative'}>
                                        <Image
                                            height={120}
                                            width={400}
                                            className={'rounded-md h-48 object-cover hover:zoom-in-50 ease-in-out transition-all duration-150'}
                                            src={property.images[0].s3Url}
                                            alt={property.name || "Property image"}
                                            />
                                    </div>
                                    <div className="px-3 py-3">
                                        <h2 className="text-sm font-bold">{property.title}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )
            }


        </div>
    );
}

export default AdminPropertyPage;