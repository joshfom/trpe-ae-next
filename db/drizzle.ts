
import { drizzle } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import * as schema from './schema-index';
import {neon} from "@neondatabase/serverless";

// This ensures this code only runs on the server
if (typeof window !== 'undefined') {
    throw new Error('This module is server-only');
}



const connectionString = process.env.DATABASE_URL!;

// For regular Node.js environment (API routes, server components, etc.)
const client = postgres(connectionString, {
    prepare: false, // Disable prepared statements to avoid perf_hooks
});

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema});