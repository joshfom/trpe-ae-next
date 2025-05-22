import React from 'react';
import Image from "next/image";

interface PhotoItemProps {
    item: {
        url: string;
        order: number;
    },
    deleteImage: () => void;
}

function PhotoItem({item, deleteImage}: PhotoItemProps) {
    const [canDelete, setCanDelete] = React.useState(false);
    return (
        <div
            key={item.order}
            onMouseEnter={() => setCanDelete(true)}
            onMouseLeave={() => setCanDelete(false)}
            className={`relative rounded-lg`}
        >
            <div className="relative w-full h-40">
                <Image 
                    src={item.url} 
                    alt="Project photo" 
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {
                canDelete &&
                <div
                    onClick={() => deleteImage()}
                    className="absolute -top-3 -right-3 p-2 bg-red-600 text-white rounded-full cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
            }
        </div>
    );
}

export default PhotoItem;