#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate diesel;
extern crate chrono;

mod schema;
mod models;



use chrono::{NaiveDateTime, Duration};



use diesel::prelude::*;
use models::*;

use rocket::response::{Redirect, content };

use rocket_contrib::serve::StaticFiles;
use chrono::NaiveDate;

#[database("postgresql_db")]
struct PgDbConn(diesel::PgConnection);


#[get("/")]
fn index() -> Redirect {
    Redirect::to("/index.html")
}

#[get("/temperature?<start>&<end>&<offset>")]
fn get_temperature(conn: PgDbConn, start: String, end: String, offset: i64) -> content::Json<String> {
    use self::schema::temperature::dsl::*;



    let start = NaiveDateTime::parse_from_str(&format!("{} 00:00:00", start), "%Y-%m-%d %H:%M:%S").unwrap();
    let end = NaiveDateTime::parse_from_str(&format!("{} 00:00:00", end), "%Y-%m-%d %H:%M:%S").unwrap();

    let start = start.checked_add_signed(Duration::minutes(offset)).unwrap();
    let end = end.checked_add_signed(Duration::minutes(offset)).unwrap();

    let results =
        temperature
            .filter(logged_at.gt(start))
            .filter(logged_at.lt(end))
            .load::<Temperature>(&conn.0).unwrap();

    content::Json(serde_json::to_string(&results).unwrap())
}

#[get("/humidity?<start>&<end>&<offset>")]
fn get_humidity(conn: PgDbConn, start: String, end: String, offset: i64) -> content::Json<String> {
    use self::schema::humidity::dsl::*;


    let start = NaiveDateTime::parse_from_str(&format!("{} 00:00:00", start), "%Y-%m-%d %H:%M:%S").unwrap();
    let end = NaiveDateTime::parse_from_str(&format!("{} 00:00:00", end), "%Y-%m-%d %H:%M:%S").unwrap();


    let start = start.checked_add_signed(Duration::minutes(offset)).unwrap();
    let end = end.checked_add_signed(Duration::minutes(offset)).unwrap();

    let results =
        humidity
            .filter(logged_at.gt(start))
            .filter(logged_at.lt(end))
            .load::<Humidity>(&conn.0).unwrap();

    content::Json(serde_json::to_string(&results).unwrap())
}

fn main() {
    rocket::ignite()
        .mount("/", routes![
                   index,
                   get_temperature,
                   get_humidity,
               ])
        .mount("/", StaticFiles::from(concat!(env!("CARGO_MANIFEST_DIR"), "/static")))
        .attach(PgDbConn::fairing())
        .launch();

}