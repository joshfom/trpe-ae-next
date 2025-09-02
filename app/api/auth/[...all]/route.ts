import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";

// Auth endpoints must be dynamic to handle authentication requests
export const dynamic = 'force-dynamic';
 
export const { POST, GET } = toNextJsHandler(auth);