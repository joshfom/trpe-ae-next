import React from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import AdminLuxeJournal from "@/features/admin/luxe/journal/components/AdminLuxeJournal";

function AdminLuxeJournalPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <div>
                    <h2 className="text-2xl">Luxe Journal</h2>
                    <p className="text-muted-foreground">Manage luxe insights and journal articles</p>
                </div>
                <nav className="flex items-center space-x-4">
                    <Link href="/admin/luxe/journal/create">
                        <Button className={'py-2'}>
                            Add Journal Article
                        </Button>
                    </Link>
                </nav>
            </div>

            <AdminLuxeJournal />
        </div>
    );
}

export default AdminLuxeJournalPage;
