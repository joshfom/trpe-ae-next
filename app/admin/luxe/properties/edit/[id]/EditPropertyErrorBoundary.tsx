"use client";

import React from 'react';

interface EditPropertyErrorBoundaryProps {
    children: React.ReactNode;
    propertyId: string;
}

// Simple wrapper that just renders children without error boundary functionality
function EditPropertyErrorBoundary({ children, propertyId }: EditPropertyErrorBoundaryProps) {
    return <>{children}</>;
}

export default EditPropertyErrorBoundary;