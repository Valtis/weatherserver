#!/usr/bin/env python3

import Adafruit_DHT
import psycopg2
import os

DATABASE_USERNAME = os.environ["DATABASE_USERNAME"]
DATABASE_PASSWORD = os.environ["DATABASE_PASSWORD"]
DATABASE_URL = os.environ["DATABASE_URL"]
DATABASE_NAME = os.environ["DATABASE_NAME"]

SENSOR=Adafruit_DHT.AM2302
GPIO_PIN=4

humidity, temperature = Adafruit_DHT.read_retry(SENSOR, GPIO_PIN)

try: 
    conn = psycopg2.connect(f"host={DATABASE_URL} dbname={DATABASE_NAME} user={DATABASE_USERNAME} password={DATABASE_PASSWORD}")
    cursor = conn.cursor()
    val = cursor.execute(f"""INSERT INTO temperature(measured_temperature) VALUES ({temperature})""")
    val = cursor.execute(f"""INSERT INTO humidity(measured_humidity) VALUES ({humidity})""")
    conn.commit()
except Exception as err:
    print("Error: " + str(err))
finally:
    cursor.close()
    conn.close()

