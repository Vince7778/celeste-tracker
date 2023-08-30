import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { closeDatabase, setupDatabase } from "./src/database/db";
import exitHook from "async-exit-hook";
import { passportRouter, setupPassport } from "./src/auth";
import expressSession from "express-session";
import SQLiteStoreFn from "connect-sqlite3";
import passport from "passport";
import { getAPIRouter } from "./src/routes/api/api";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (
    !process.env.SESSION_SECRET ||
    !process.env.SESSION_DB_FILE ||
    !process.env.SESSION_DB_DIR
) {
    throw new Error("Session secret + database file required in .env");
}
const SQLiteStore = SQLiteStoreFn(expressSession);

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // @ts-ignore
        store: new SQLiteStore({
            db: process.env.SESSION_DB_FILE,
            dir: process.env.SESSION_DB_DIR,
        }),
    }),
);

app.use(passport.authenticate("session"));

app.post(
    "/login/password",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
);

const port = process.env.PORT || 8000;

async function setup() {
    await setupDatabase();
    setupPassport();
    app.use("/", passportRouter());
    app.use("/api", getAPIRouter());

    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../client/build")));

        app.get("/*", (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, "../client/build", "index.html"));
        });
    }

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

async function exit() {
    await closeDatabase();
}

setup();

exitHook((callback) => {
    exit().then(callback);
});
