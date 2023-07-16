import fs from "fs";
import path from "path";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import versionJson from "../sql/version.json";

const SCHEMA_PATH = "src/sql/schema.sql";

let db: Database | null;

async function loadDatabase() {
    const dbPath = process.env.DATABASE_FILE;
    if (!dbPath) throw new Error(".env does not have key DATABASE_FILE");
    if (fs.existsSync(dbPath)) {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        // version check
        const version = (await db.get("PRAGMA user_version"))
            .user_version as number;
        if (version !== versionJson.version) {
            throw new Error(
                `Database has version ${version} while latest is ${versionJson.version}!\nRun the update scripts.`,
            );
        }

        return db;
    } else {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        // load schema
        let schema: Buffer;
        try {
            schema = await fs.promises.readFile(SCHEMA_PATH);
        } catch (e) {
            console.log("Error reading schema file!");
            throw e;
        }

        await db.exec(schema.toString());

        console.log("Schema loaded");
        return db;
    }
}

export async function setupDatabase() {
    db = await loadDatabase();
}

export function getDatabase() {
    if (!db) throw new Error("Database not yet loaded!");
    return db;
}

export async function closeDatabase() {
    if (db) await db.close();
}
