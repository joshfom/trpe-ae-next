"use client";
import React from 'react';
import Link from 'next/link';
import { PageMeta } from '@/lib/types/page-meta';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Eye 
} from 'lucide-react';
import {useGetAdminPageMetas} from "@/features/admin/page-meta/api/use-get-admin-page-metas";
import {client} from "@/lib/hono";
import {toast} from "sonner";



export function PageMetaList() {

  const pageMetaQuery = useGetAdminPageMetas();

    const pageMetas = pageMetaQuery.data || [];



    // Function to handle deletion of a page meta


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Page Meta</h2>
        <Link href="/admin/page-meta/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Page
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Path</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageMetas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No pages found. Create a new page to get started.
              </TableCell>
            </TableRow>
          ) : (
            pageMetas.map((pageMeta: PageMeta) => (
              <TableRow key={pageMeta.id}>
                <TableCell className="font-medium">{pageMeta.path}</TableCell>
                <TableCell>{pageMeta.title}</TableCell>
                <TableCell>{pageMeta.metaTitle}</TableCell>
                <TableCell>
                  {pageMeta.updatedAt
                    ? new Date(pageMeta.updatedAt).toLocaleDateString()
                    : new Date(pageMeta.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={pageMeta.path} target="_blank">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/page-meta/${pageMeta.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"

                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
