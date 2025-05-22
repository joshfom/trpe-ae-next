import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: ['./db/schema/*', './auth-schema.ts'],
  dialect: "postgresql",
  out: './db/migrations',
  extensionsFilters: ["postgis"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
