import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { getDatabase } from "./database/db";
import crypto from "crypto";
import { promisify } from "util";
import express from "express";
import { ISqlite } from "sqlite";

interface UsernameID {
    id: string;
    username: string;
}

type callbackType = (
    error: any,
    user?: false | Express.User | undefined,
    options?: IVerifyOptions | undefined,
) => void;

const FAILURE_MESSAGE = "Incorrect username or password.";

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,32}$/;

async function verify(
    username: string,
    password: string,
    callback: callbackType,
) {
    // get user id from username
    const db = getDatabase();
    let id: number;
    try {
        const userRow: Partial<SQLUsers> | undefined = await db.get(
            "SELECT id, username FROM users WHERE username = ?",
            [username],
        );
        if (!userRow?.id) {
            callback(null, false, { message: FAILURE_MESSAGE });
            return;
        }
        id = userRow.id;
    } catch (e) {
        console.error("Error fetching user:\n" + e);
        callback(e);
        return;
    }

    let accountDetails: Partial<SQLAccounts>;
    try {
        const accountRow: Partial<SQLAccounts> | undefined = await db.get(
            "SELECT id, hashed_password, salt FROM accounts WHERE id = ?",
            [id],
        );
        if (!accountRow) {
            console.error(
                `User ${username} (id: ${id}) has profile but no account?`,
            );
            callback("Error fetching user account");
            return;
        }
        if (!accountRow.hashed_password || !accountRow.salt || !accountRow.id) {
            // user does not have this login method
            callback(null, false, { message: FAILURE_MESSAGE });
            return;
        }
        accountDetails = accountRow;
    } catch (e) {
        console.error("Error fetching user:\n" + e);
        callback(e);
        return;
    }

    let hashed: Buffer;
    try {
        hashed = await promisify(crypto.pbkdf2)(
            password,
            accountDetails.salt!,
            310000,
            32,
            "sha256",
        );
    } catch (e) {
        console.error("Error hashing password:\n" + e);
        callback(e);
        return;
    }

    if (!crypto.timingSafeEqual(accountDetails.hashed_password!, hashed)) {
        callback(null, false, { message: FAILURE_MESSAGE });
        return;
    }
    callback(null, accountDetails);
}

export function setupPassport() {
    passport.use(new LocalStrategy(verify));

    passport.serializeUser((user: any, cb) => {
        process.nextTick(() => {
            return cb(null, {
                id: user.id,
                username: user.username,
            });
        });
    });

    passport.deserializeUser((user: any, cb) => {
        process.nextTick(() => {
            return cb(null, user);
        });
    });
}

// needs db to be initialized first
export function passportRouter() {
    const router = express.Router();

    router.post("/signup", async (req, res, next) => {
        const salt = crypto.randomBytes(16);
        if (!req.body.password || !req.body.username) {
            return next(new Error("Missing username or password"));
        }

        const username = req.body.username as string;
        if (!username.match(USERNAME_REGEX)) {
            return next(
                new Error(
                    "Username must be alphanumeric and between 3 and 32 characters.",
                ),
            );
        }

        // make sure username is not already taken
        const db = getDatabase();
        let usernameTaken: boolean;
        try {
            const usernameCount = await db.get(
                "SELECT COUNT(id) AS count FROM users WHERE username = ?",
                [username],
            );
            usernameTaken = usernameCount.count > 0;
        } catch (err) {
            return next(err);
        }

        let hashed: Buffer;
        try {
            hashed = await promisify(crypto.pbkdf2)(
                req.body.password,
                salt,
                310000,
                32,
                "sha256",
            );
        } catch (err) {
            return next(err);
        }

        let runResult: ISqlite.RunResult;
        try {
            runResult = await db.run(
                "INSERT INTO accounts(hashed_password, salt) VALUES (?, ?)",
                [hashed, salt],
            );
        } catch (err) {
            return next(err);
        }

        if (!runResult.lastID) {
            return next(new Error("DB insert did not return a row ID"));
        }

        // get user id
        let userID: number;
        try {
            const accountRow: Partial<SQLAccounts> | undefined = await db.get(
                "SELECT id FROM accounts WHERE rowid = ?",
                [runResult.lastID],
            );

            if (!accountRow?.id) {
                throw new Error("Insert failed; could not fetch id");
            }
            userID = accountRow.id;
        } catch (err) {
            return next(err);
        }

        // create profile
        const creationDate = new Date().toISOString();
        try {
            await db.run(
                "INSERT INTO users(id, username, creation_date) VALUES (?, ?, ?)",
                [userID, req.body.username, creationDate],
            );
        } catch (err) {
            return next(err);
        }

        console.log(
            `Account for ${req.body.username} (id ${userID}) created successfully`,
        );

        const userJSON = {
            id: userID,
            username: req.body.username,
        };

        try {
            await promisify(req.login)(userJSON);
        } catch (err) {
            return next(err);
        }
        res.redirect("/");
    });

    return router;
}
