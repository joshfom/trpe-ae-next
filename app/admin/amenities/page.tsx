"use client"
import Link from "next/link";
import {useGetAdminAmenities} from "@/features/admin/amenity/api/use-get-admin-amenities";

// Define the Amenity interface if not already imported
interface Amenity {
    id: string;
    name: string;
    icon: string;
    // Add other properties as needed
}

function AdminPropertyPage() {

    const amenityQuery = useGetAdminAmenities()
    const amenities = amenityQuery.data as Amenity[] | null


    return (
        <div className={'w-full'}>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Amenities </div>
                </div>

                <div className="items-center flex   space-x-4">
                    <Link className={'py-2 px-6 rounded-xl border'} href={'/admin/amenities/create'}>
                        New Amenity
                    </Link>
                </div>
            </div>


            {
                amenities?.length === 0 && (
                    <div className={' flex-1 mt-4 flex flex-col items-center space-y-8 justify-center h-96'}>
                        <p>You have not created any amenities yet.</p>
                    </div>
                )
            }

            {
                amenities &&
                 amenities?.length > 0 && (
                    <div className="mt-6 grid grid-cols-6 gap-6">
                        {amenities.map((amenity: any) => (
                            <div className="bg-white rounded flex flex-col justify-between" key={amenity.id}>
                                <div className="flex items-center">
                                    <div className={'relative'}>
                                        <img
                                            height={10}
                                            width={10}
                                            className={'object-cover hover:zoom-in-50 ease-in-out transition-all duration-150'}
                                            src={amenity.icon}
                                            alt={amenity.name}/>
                                    </div>
                                    <div className="px-3 py-3">
                                        <h2 className="text-sm">{amenity.name}</h2>
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