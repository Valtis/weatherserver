-- Your SQL goes here

CREATE TABLE temperature(
	id SERIAL PRIMARY KEY,
	measured_temperature TEXT NOT NULL,
	logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX logged_idx ON temperature (
	logged_at
);
