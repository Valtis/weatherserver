table! {
    humidity (id) {
        id -> Int4,
        measured_humidity -> Text,
        logged_at -> Timestamptz,
    }
}

table! {
    temperature (id) {
        id -> Int4,
        measured_temperature -> Text,
        logged_at -> Timestamptz,
    }
}

allow_tables_to_appear_in_same_query!(
    humidity,
    temperature,
);
