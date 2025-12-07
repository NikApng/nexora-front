import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";
import path from "path";

const dbPath = path.join(process.cwd(), "db.sqlite");

const sqlite = new Database(dbPath);

const ensureColumn = (table: string, column: string, ddl: string) => {
    const info = sqlite.prepare(`PRAGMA table_info(${table});`).all() as Array<{ name: string }>;
    const exists = info.some((col) => col.name === column);
    if (!exists) {
        sqlite.exec(ddl);
    }
};

sqlite.exec(`
CREATE TABLE IF NOT EXISTS project_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    created_at INTEGER,
    UNIQUE(project_id, user_id, type)
);
CREATE INDEX IF NOT EXISTS project_reactions_project_idx ON project_reactions(project_id);
CREATE INDEX IF NOT EXISTS project_reactions_user_idx ON project_reactions(user_id);
`);

ensureColumn("projects", "code", "ALTER TABLE projects ADD COLUMN code TEXT;");
ensureColumn("projects", "code_filename", "ALTER TABLE projects ADD COLUMN code_filename TEXT;");
ensureColumn("projects", "code_structure", "ALTER TABLE projects ADD COLUMN code_structure TEXT;");
export const db = drizzle(sqlite, { schema });
