"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthStatus() {
    const { data: session, isPending, error } = useSession();
    
    if (isPending) {
        return <div className="text-sm text-gray-600">Checking authentication...</div>;
    }
    
    if (error) {
        return (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md">
                <p className="font-medium">Authentication Error</p>
                <p className="text-sm">{error.message}</p>
            </div>
        );
    }
    
    if (!session) {
        return (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-2 rounded-md">
                <p className="font-medium">Not Authenticated</p>
                <p className="text-sm mb-2">You need to be logged in to access admin features.</p>
                <Link href="/login">
                    <Button size="sm" variant="outline">
                        Sign In
                    </Button>
                </Link>
            </div>
        );
    }
    
    return (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md">
            <p className="font-medium">Authenticated</p>
            <p className="text-sm">Logged in as: {session.user.email}</p>
        </div>
    );
}
