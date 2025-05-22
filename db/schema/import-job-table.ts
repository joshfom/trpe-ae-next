import {integer, jsonb, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


export const ImportJobStatus = pgEnum(
    "import_job_types", [
        "pending",
        "running",
        "completed",
        "failed",
    ]
)

export const importJobTable = pgTable("import_jobs", {
    id: text('id').primaryKey().notNull(),
    status: ImportJobStatus('status').default('pending'),
    propertyCount: integer("property_count"),
    importedCount: integer("imported_count"),
    updatedCount: integer("updated_count"),
    failedCount: integer("failed_count"),
    failedProperties: jsonb("failed_properties"),
    startedAt: timestamp("started_at", {withTimezone: true, mode: 'string'}),
    finishedAt: timestamp("finished_at", {withTimezone: true, mode: 'string'}),
    createdAt: timestamp("created_at", {withTimezone: true, mode: 'string'}).default(sql`now()`).notNull(),
});



