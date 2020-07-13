-- Your SQL goes here

ALTER TABLE temperature ALTER COLUMN logged_at TYPE TIMESTAMP WITH TIME ZONE USING logged_at AT TIME ZONE 'UTC';
