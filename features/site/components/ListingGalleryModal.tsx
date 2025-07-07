import React from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {PropertyType} from "@/types/property";

interface ListingGalleryOverViewProps {
    property: PropertyType,
    isOpen: boolean,
    onClose: () => void
}

function ListingGalleryModal({property, isOpen, onClose}: ListingGalleryOverViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={'lg:w-[70%] sm:w-[90%] h-[90%] flex flex-col'}>
                <DialogHeader>

                    <DialogTitle>Gallery for {property.title}</DialogTitle>
                    <DialogDescription className={'hidden space-x-4 lg:flex'}>
                        <div className="flex space-x-3">
                            <span>Bedrooms</span>
                            <span>
                            {
                                property.bedrooms
                            }
                        </span>
                        </div>
                        <div className="flex space-x-3">
                            <span>Bathrooms</span>
                            <span>
                            {
                                property.bathrooms
                            }
                        </span>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className={'grow overflow-y-auto'}>
                    <div className="w-full lg:w-[80%] mx-auto space-y-4">
                        {
                            property.images.map((image, index) => {
                                return (
                                    <img key={index} src={image.s3Url} alt={property.title}
                                         className={'w-[90%] rounded-xl mx-auto h-auto'}/>
                                )
                            })
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ListingGalleryModal;