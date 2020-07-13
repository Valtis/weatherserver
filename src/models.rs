use chrono::DateTime;
use chrono::Utc;
use serde::Serialize;

#[derive(Debug, Queryable, Serialize)]
pub struct Temperature {
    pub id: i32,
    pub measured_temperature: String,
    pub logged_at: DateTime<Utc>,
}

#[derive(Debug, Queryable, Serialize)]
pub struct Humidity {
    pub id: i32,
    pub measured_humidity: String,
    pub logged_at: DateTime<Utc>,
}