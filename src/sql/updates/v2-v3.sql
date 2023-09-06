ALTER TABLE celeste_maps ADD COLUMN preview_image_url TEXT;
ALTER TABLE celeste_maps ADD COLUMN last_updated TEXT NOT NULL DEFAULT '1970-01-01 00:00:00';
PRAGMA user_version = 3;