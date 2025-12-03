import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";
import path from "path";

const dbPath = path.join(process.cwd(), "db.sqlite");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export function initDatabase() {
  try {
    // Создаем таблицу users если её нет
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);
    console.log("✅ Database initialized");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

if (typeof window === "undefined") {
  initDatabase();
}

