-- This file should undo anything in `up.sql`

ALTER TABLE temperature ALTER COLUMN logged_at TYPE TIMESTAMP WITHOUT TIME ZONE;
