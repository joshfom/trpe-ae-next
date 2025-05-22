"use client"

import React from 'react';
import PropertyTypeForm from "@/features/admin/property-types/components/PropertyTypeForm";

interface PropertyTypeEditorProps {
  propertyType: UnitType;
}

export default function PropertyTypeEditor({ propertyType }: PropertyTypeEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <PropertyTypeForm propertyType={propertyType} />
    </div>
  );
}