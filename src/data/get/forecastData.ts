import { ISODateString } from '../../services/openMeteoService.js';
import db from '../DB.js';

type BeachId = number;

type Granularity = "hourly" | "daily";
type DataType = "weather" | "marine";

// Base shared data
interface BaseData {
  id: number;
  beach_id: number;
  date: ISODateString;
  metrics: Record<string, number | Date>;
}

// More specific types for convenience (optional but helpful)
export interface HourlyWeatherData extends BaseData {
  metrics: {
    temperature_2m: number;
    precipitation_probability: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
}

export interface DailyWeatherData extends BaseData {
  metrics: {
    temperature_2m_max: number;
    temperature_2m_min: number;
    precipitation_sum: number;
    precipitation_probability_max: number;
    wind_speed_10m_max: number;
    uv_index_max: number;
  };
  sunrise: Date;
  sunset: Date;
}

export interface HourlyMarineData extends BaseData {
  metrics: {
    wave_height: number;
    sea_surface_temperature: number;
    ocean_current_velocity: number;
    ocean_current_direction: number;
    sea_level_height_msl: number;
    swell_wave_height: number;
    swell_wave_period: number;
  };
}

export interface DailyMarineData extends BaseData {
  metrics: {
    wave_height_max: number;
  };
}

// --- getData Overloads ---
export function getData(beachId: BeachId, granularity: "hourly", type: "weather"): HourlyWeatherData[];
export function getData(beachId: BeachId, granularity: "hourly", type: "marine"): HourlyMarineData[];
export function getData(beachId: BeachId, granularity: "daily", type: "weather"): DailyWeatherData[];
export function getData(beachId: BeachId, granularity: "daily", type: "marine"): DailyMarineData[];

// --- getData Implementation ---
export function getData(beachId: BeachId, granularity: Granularity, type: DataType): BaseData[] {
  const table = `${granularity}_${type}`;
  const stmt = db.prepare(`
    SELECT * FROM ${table}
    WHERE beach_id = ?
    ORDER BY date ASC
  `);

  const raw = stmt.all(beachId);

  // Type narrowing
  if (granularity === "hourly" && type === "weather") {
    return raw as HourlyWeatherData[];
  } else if (granularity === "hourly" && type === "marine") {
    return raw as HourlyMarineData[];
  } else if (granularity === "daily" && type === "weather") {
    return raw as DailyWeatherData[];
  } else {
    return raw as DailyMarineData[];
  }
}


// --- getAllForecastData Overloads ---
export function getAllForecastData(granularity: "hourly", type: "weather"): HourlyWeatherData[];
export function getAllForecastData(granularity: "hourly", type: "marine"): HourlyMarineData[];
export function getAllForecastData(granularity: "daily", type: "weather"): DailyWeatherData[];
export function getAllForecastData(granularity: "daily", type: "marine"): DailyMarineData[];

// --- getAllForecastData Implementation ---
export function getAllForecastData(granularity: Granularity, type: DataType): BaseData[] {
  const table = `${granularity}_${type}`;
  const stmt = db.prepare(`
    SELECT * FROM ${table}
    ORDER BY date ASC
  `);

  const raw = stmt.all();

  // Type narrowing
  if (granularity === "hourly" && type === "weather") {
    return raw as HourlyWeatherData[];
  } else if (granularity === "hourly" && type === "marine") {
    return raw as HourlyMarineData[];
  } else if (granularity === "daily" && type === "weather") {
    return raw as DailyWeatherData[];
  } else {
    return raw as DailyMarineData[];
  }
}
