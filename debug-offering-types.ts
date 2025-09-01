import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { offeringTypeTable } from './db/schema/offering-type-table';

async function checkOfferingTypes() {
  const sql = postgres(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  
  try {
    const types = await db.select().from(offeringTypeTable);
    console.log('All offering types:');
    types.forEach(type => {
      console.log(`ID: ${type.id}, Slug: ${type.slug}, Name: ${type.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

checkOfferingTypes();
