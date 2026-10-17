import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const workspaces = sqliteTable("workspaces", { id: text("id").primaryKey(), payload: text("payload").notNull(), version: integer("version").notNull().default(0) });
