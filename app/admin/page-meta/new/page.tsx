import React from 'react';
import { redirect } from 'next/navigation';
import { PageMetaForm } from '@/features/admin/page-meta/components/page-meta-form';
import { client } from '@/lib/hono';
import { PageMetaFormSchema } from '@/lib/types/form-schema/page-meta-form-schema';
import { z } from 'zod';
import { toast } from 'sonner';

export default function NewPageMetaPage() {
  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Page</h1>
        <PageMetaForm
        />
      </div>
    </div>
  );
}
