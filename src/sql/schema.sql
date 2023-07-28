-- Defines tables and views and stuff.
-- Automatically executed to create a new database.
-- If you make changes, make sure to write a migration script
--   to migrate existing databases.

CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hashed_password BLOB,
    salt BLOB
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    creation_date TEXT
);

PRAGMA user_version = 1;
