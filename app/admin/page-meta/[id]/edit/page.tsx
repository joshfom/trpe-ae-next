
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { PageMetaForm } from '@/features/admin/page-meta/components/page-meta-form';
import { client } from '@/lib/hono';
import { PageMetaFormSchema } from '@/lib/types/form-schema/page-meta-form-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { pageMetaTable } from '@/db/schema-index';
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";

interface EditPageMetaPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function EditPageMetaPage(props: EditPageMetaPageProps) {
    const id = (await props.params).id;

    const pageMeta = db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.id, id)
    }) as unknown as PageMetaType

    if (!pageMeta) {
        return notFound();

    }


    return (
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Page</h1>
          <PageMetaForm 
            defaultValues={pageMeta}
          />
        </div>
      </div>
    );

}
