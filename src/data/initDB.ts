import db from "./DB.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS beaches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    latitude REAL,
    longitude REAL
  );

  CREATE TABLE IF NOT EXISTS daily_weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beach_id INTEGER,
    date TEXT,
    temperature2m_max REAL,
    temperature2m_min REAL,
    precipitation_sum REAL,
    precipitation_probability_max REAL,
    wind_speed_10m_max REAL,
    uv_index_max REAL,
    sunrise TEXT,
    sunset TEXT,
    FOREIGN KEY (beach_id) REFERENCES beaches(id),
    UNIQUE(beach_id, date)
  );

  CREATE TABLE IF NOT EXISTS daily_marine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beach_id INTEGER,
    date TEXT,
    wave_height_max REAL,
    FOREIGN KEY (beach_id) REFERENCES beaches(id),
    UNIQUE(beach_id, date)
  );

  CREATE TABLE IF NOT EXISTS hourly_weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beach_id INTEGER,
    date TEXT,
    temperature_2m REAL,
    precipitation_probability REAL,
    cloud_cover REAL,
    wind_speed_10m REAL,
    wind_direction REAL,
    FOREIGN KEY (beach_id) REFERENCES beaches(id),
    UNIQUE(beach_id, date)
  );

  CREATE TABLE IF NOT EXISTS hourly_marine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beach_id INTEGER,
    date TEXT,
    wave_height REAL,
    sea_surface_temperature REAL,
    ocean_current_velocity REAL,
    ocean_current_direction REAL,
    sea_level_height_msl REAL,
    swell_wave_height REAL,
    swell_wave_period REAL,
    FOREIGN KEY (beach_id) REFERENCES beaches(id),
    UNIQUE(beach_id, date)
  );
`);
