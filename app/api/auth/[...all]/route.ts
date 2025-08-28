import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";

// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for auth routes - return common auth endpoints
export async function generateStaticParams() {
    return [
        { all: ['sign-in'] },
        { all: ['sign-up'] },
        { all: ['sign-out'] },
        { all: ['session'] },
        { all: ['callback'] },
    ];
}
 
export const { POST, GET } = toNextJsHandler(auth);