import { open } from "sqlite";
import sqlite3 from "sqlite3";
import fs from "fs";
import versionJson from "./src/sql/version.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();

async function runSQLFile(curdb, path) {
    let schema;
    try {
        schema = await fs.promises.readFile(path);
    } catch (e) {
        console.log("Error reading schema file!");
        throw e;
    }

    await curdb.exec(schema.toString());
}

async function updateDB() {
    const dbPath = process.env.DATABASE_FILE;
    if (!dbPath) throw new Error(".env does not have key DATABASE_FILE");

    let curdb;
    if (fs.existsSync(dbPath)) {
        curdb = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        // version check
        let version = (await curdb.get("PRAGMA user_version")).user_version;
        const updates = versionJson.updates;
        while (version !== versionJson.version) {
            // update database
            const updateFile = updates[version.toString()];
            if (!updateFile) {
                throw new Error("No update file found for version " + version);
            }

            const updatePath = `src/sql/updates/${updateFile}`;
            await runSQLFile(curdb, updatePath);
            version = (await curdb.get("PRAGMA user_version")).user_version;
        }

        console.log("Update completed successfully, new version is " + version);
    } else {
        throw new Error("Database file not found");
    }
}

updateDB();
