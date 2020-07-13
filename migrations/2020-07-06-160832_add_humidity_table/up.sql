-- Your SQL goes here

CREATE TABLE humidity(
	id SERIAL PRIMARY KEY,
	measured_humidity TEXT NOT NULL,
	logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX humidity_logged_idx ON humidity(
	logged_at
);
