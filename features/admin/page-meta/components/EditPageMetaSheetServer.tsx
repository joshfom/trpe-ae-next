"use client"

import React from 'react';
import { EditPageMetaSheet } from './EditPageMetaSheet';
import { PageMetaType } from "@/features/admin/page-meta/types/page-meta-type";

interface EditPageMetaSheetServerProps {
    pageMeta?: PageMetaType;
    pathname?: string;
}

// Client-side wrapper that renders the admin component
export function EditPageMetaSheetServer({ pageMeta, pathname }: EditPageMetaSheetServerProps) {
    return <EditPageMetaSheet pageMeta={pageMeta} pathname={pathname} />;
}