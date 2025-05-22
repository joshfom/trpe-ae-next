import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface ImageItemProps {
    url: string;
    index: number;
    deleteImage: () => void;
}
function ImageItem({url,  index, deleteImage}: ImageItemProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: url});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [canDelete, setCanDelete] = React.useState(false);

    return (
        <div
            key={index}
            onMouseEnter={() => setCanDelete(true)}
            onMouseLeave={() => setCanDelete(false)}
            className={` h-32 w-full relative rounded-lg overflow-hidden`}>
            <img
                loading="lazy"
                src={url}
                className="object-cover absolute inset-0 size-full cursor-pointer"

            />

            {
                canDelete &&
                <div
                    onClick={() => deleteImage()}
                    className="absolute top-2 right-2 p-2 bg-white hover:bg-red-600 hover:text-white rounded-full cursor-pointer">
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

export default ImageItem;