"use client"
import React from 'react';
import PropertyTypeForm from "@/features/admin/property-types/components/PropertyTypeForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function CreatePropertyTypePage() {
    const router = useRouter();
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center py-8 px-8">
                <h2 className="text-2xl">Create Property Type</h2>
                <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <PropertyTypeForm 
                    onSuccess={() => router.push('/admin/property-types')}
                />
            </div>
        </div>
    );
}

export default CreatePropertyTypePage;