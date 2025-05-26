import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-index';

// This ensures this code only runs on the server
if (typeof window !== 'undefined') {
    throw new Error('This module is server-only');
}


const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle( queryClient, {schema });