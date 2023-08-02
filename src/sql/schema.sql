-- Defines tables and views and stuff.
-- Automatically executed to create a new database.
-- If you make changes, make sure to write a migration script
--   to migrate existing databases.

-- DO NOT REMOVE THIS
PRAGMA foreign_keys = ON;

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

CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT
);

CREATE TABLE user_roles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE celeste_maps (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    gb_mod_id TEXT UNIQUE -- mod id on GameBanana
);

CREATE TABLE celeste_map_chapters (
    id INTEGER PRIMARY KEY,
    map_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(map_id) REFERENCES celeste_maps(id) ON DELETE CASCADE
);

-- create roles
INSERT INTO roles(name, display_name) VALUES ('admin', 'Administrator');

PRAGMA user_version = 2;
