// data.ts
import { Request, Response } from 'express';
import { getAllBeaches } from "../data/get/beachData.js";
import type { BeachData } from '../data/get/beachData.js';
import {
  getAllForecastData,
  DailyWeatherData,
  DailyMarineData,
  HourlyWeatherData,
  HourlyMarineData
} from '../data/get/forecastData.js';

// --- Beaches Controller ---
export function getBeachesController(req: Request, res: Response) {
  try {
    const beaches: BeachData[] = getAllBeaches();
    res.status(200).json(beaches);
  } catch (err) {
    console.error('Failed to retrieve beaches:', err);
    res.status(500).json({ error: 'Failed to retrieve beach data' });
  }
}

// --- Forecast Factory Controller ---
function createForecastController<T>(
  type: "daily" | "hourly",
  granularity: "weather" | "marine",
  errorMsg: string,
  castFn: () => T[] // 👈 Added to help TS infer correct return type
) {
  return (_req: Request, res: Response) => {
    try {
      const data = castFn();
      if (!data || data.length === 0) {
        return res.status(404).json({ error: `No ${errorMsg} data found` });
      }
      res.status(200).json(data);
    } catch (err) {
      console.error(`Failed to retrieve ${errorMsg} data:`, err);
      res.status(500).json({ error: `Failed to retrieve ${errorMsg} data` });
    }
  };
}

// --- Forecast Controllers ---
export const getDailyWeatherController = createForecastController<DailyWeatherData>(
  "daily", "weather", "daily weather", () => getAllForecastData("daily", "weather")
);

export const getDailyMarineController = createForecastController<DailyMarineData>(
  "daily", "marine", "daily marine", () => getAllForecastData("daily", "marine")
);

export const getHourlyWeatherController = createForecastController<HourlyWeatherData>(
  "hourly", "weather", "hourly weather", () => getAllForecastData("hourly", "weather")
);

export const getHourlyMarineController = createForecastController<HourlyMarineData>(
  "hourly", "marine", "hourly marine", () => getAllForecastData("hourly", "marine")
);