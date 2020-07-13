#Weather station project for Raspberry Pi

Code for weather station setup using DHT-22 sensor and Raspberry Pi. Consists of data gathering script and a webapp for displaying the results

## PostgreSQL Server
* Set up a PostgreSQL database on a machine. See appropriate PostgreSQL documentation
* Create a database using `createdb`
* Make sure your credentials, database name and database URL are available for the following steps

## Webapp server

* Install libpq5-dev, required for build
* Install Rust compiler using rustup, see rustup documentation for more information
  * **NOTE**: Nightly compiler needed at the time of writing due to the web framework needing yet-to-be-stabilized features.
* Set the following env variables:
  * DATABASE\_USERNAME
  * DATABASE\_PASSWORD
  * DATABASE\_NAME
  * DATABASE\_URL
* Run script `config.sh`
* Build the server
  * `cargo build --release`
* Install Diesel CLI
  * `cargo install diesel_cli --no-default-features --features postgres`
* Apply DB migrations
    * `diesel migration run`
* **OPTIONAL**: Add following section to Rocket.toml and change port to 443, if TLS certs are used:
```
[global.tls]  
certs = "/path/to/cert"  
key = "/path/to/keyfile"  
```
* Update the `weatherserver.service` Systemd service file to point to correct directories (ExecStart and WorkingDirectory)
* Copy the service file into /lib/systemd/system/ - directory. 
* Change ownership to root
* Enable and run the server 
  * `sudo systemctl enable weatherserver.service`
  * `sudo systemctl start weatherserver.service`

## Raspberry PI:

* Set up the hardware
* Install AdaFruit Python script for reading temperature and humidity data:
  * `pip3 install Adafruit_DHT`
* Install PostgreSQL connection library:
  * `pip3 install psycopg2`
* Set the following env variables:
  * DATABASE\_USERNAME
  * DATABASE\_PASSWORD
  * DATABASE\_NAME
  * DATABASE\_URL

* Copy file `weatherscript.py` to some directory. 
Update SENSOR and GPIO\_PIN variables based on your sensor type and data pin used.
* Add a cronjob that periodically executes the script



