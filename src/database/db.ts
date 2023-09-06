import fs from "fs";
import path from "path";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import versionJson from "../sql/version.json";
import crypto from "crypto";

const SCHEMA_PATH = "src/sql/schema.sql";

let db: Database | null;

export async function runSQLFile(curdb: Database, path: string) {
    let schema: Buffer;
    try {
        schema = await fs.promises.readFile(path);
    } catch (e) {
        console.log("Error reading schema file!");
        throw e;
    }

    await curdb.exec(schema.toString());
}

async function loadDatabase() {
    const dbPath = process.env.DATABASE_FILE;
    if (!dbPath) throw new Error(".env does not have key DATABASE_FILE");

    let curdb: Database;
    if (fs.existsSync(dbPath)) {
        curdb = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        // version check
        const version = (await curdb.get("PRAGMA user_version"))
            .user_version as number;
        if (version !== versionJson.version) {
            throw new Error(
                `Database has version ${version} while latest is ${versionJson.version}!\nRun the update scripts.`,
            );
        }

        // enable foreign keys
        await curdb.exec("PRAGMA foreign_keys = ON");
    } else {
        curdb = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        // load schema
        runSQLFile(curdb, SCHEMA_PATH);

        console.log("Schema loaded");

        // create admin user
        // hackers, if there's a vulnerability, it's probably here :)
        const adminPW = process.env.DEFAULT_ADMIN_PASSWORD;
        if (!adminPW)
            throw new Error(".env does not have key DEFAULT_ADMIN_PASSWORD");

        const salt = crypto.randomBytes(16);
        const runResult = await curdb.run(
            "INSERT INTO accounts(hashed_password, salt) VALUES (?, ?)",
            [crypto.pbkdf2Sync(adminPW, salt, 310000, 32, "sha256"), salt],
        );

        const rowid = runResult.lastID;
        if (!rowid) {
            throw new Error(
                "Admin user creation did not succeed? Row ID missing",
            );
        }
        await curdb.run(
            "INSERT INTO users(id, username, creation_date) VALUES (?, ?, ?)",
            [rowid, "admin", new Date().toISOString()],
        );

        // give admin role
        const adminRoleID = await curdb.get<Partial<SQLRoles>>(
            "SELECT id FROM roles WHERE name = 'admin'",
        );
        if (!adminRoleID || !adminRoleID.id)
            throw new Error("Admin role not found");
        await curdb.run(
            "INSERT INTO user_roles(user_id, role_id) VALUES (?, ?)",
            [rowid, adminRoleID.id],
        );

        console.log("Admin user created");
    }

    return curdb;
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
