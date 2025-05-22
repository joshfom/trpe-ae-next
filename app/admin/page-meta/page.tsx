import React from 'react';
import { notFound } from 'next/navigation';
import { client } from '@/lib/hono';
import { PageMetaList } from '@/features/admin/page-meta/components/page-meta-list';
import { PageMeta } from '@/lib/types/page-meta';
import { toast } from 'sonner';

export default async function AdminPageMetaPage() {




    return (
      <div className="container py-10">
        <PageMetaList
        />
      </div>
    );

}
