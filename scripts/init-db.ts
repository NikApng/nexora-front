import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../db/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database("./db.sqlite");
const db = drizzle(sqlite, { schema });

async function initDb() {
  try {
    // Применяем миграции
    migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initDb();

