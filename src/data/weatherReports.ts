import { loadBeaches, getOrCreateBeachId } from "./loadBeaches.js";
import type { Beach } from "./loadBeaches.js";
import { Weather, Marine } from "../services/openMeteoService.js";
import { store } from './storeForecasts.js';
import type { ISODateString } from "../services/openMeteoService.js";
import db from "./DB.js";  // Make sure you import your DB instance

type Granularity = "daily" | "hourly";

function getForecastRange(granularity: Granularity): { start: ISODateString; end: ISODateString } {
  const today = new Date();
  const future = new Date(today);

  if (granularity === "hourly") {
    future.setDate(today.getDate() + 3);
  } else {
    future.setDate(today.getDate() + 14);
  }

  const format = (date: Date): ISODateString =>
    date.toISOString().split('T')[0] as ISODateString;

  return {
    start: format(today),
    end: format(future),
  };
}

export async function fetchAndCacheForecasts(granularity: Granularity = "daily") {
  const beaches: Beach[] = await loadBeaches();
  const timeRange = getForecastRange(granularity);

  for (const beach of beaches) {
    console.log(`Fetching ${granularity} data for ${beach.name}...`);

    const coords = { latitude: beach.latitude, longitude: beach.longitude };
    const weather = new Weather(coords, timeRange);
    const marine = new Marine(coords, timeRange);

    try {
      const beachId = getOrCreateBeachId(beach.name, beach.latitude, beach.longitude);

      // <-- CLEANUP STEP: delete old data for this beach BEFORE inserting new data
      if (granularity === "daily") {
        db.prepare(`DELETE FROM daily_marine WHERE beach_id = ?`).run(beachId);
        db.prepare(`DELETE FROM daily_weather WHERE beach_id = ?`).run(beachId);
      } else if (granularity === "hourly") {
        db.prepare(`DELETE FROM hourly_marine WHERE beach_id = ?`).run(beachId);
        db.prepare(`DELETE FROM hourly_weather WHERE beach_id = ?`).run(beachId);
      }

      switch (granularity) {
        case "daily": {
          const [dailyWeather, dailyMarine] = await Promise.all([
            weather.fetchDaily(),
            marine.fetchDaily()
          ]);
          
          store.daily.weather(beachId, timeRange.start, dailyWeather);
          store.daily.marine(beachId, timeRange.start, dailyMarine);
          break;
        }

        case "hourly": {
          const [hourlyWeather, hourlyMarine] = await Promise.all([
            weather.fetchHourly(),
            marine.fetchHourly()
          ]);
          
          store.hourly.weather(beachId, timeRange.start, hourlyWeather);
          store.hourly.marine(beachId, timeRange.start, hourlyMarine);
          break;
        }

        default:
          throw new Error(`Unsupported granularity: ${granularity}`);
      }

      console.log(`Stored ${granularity} forecast for ${beach.name}`);
    } catch (error) {
      console.error(`⚠️ Failed to fetch ${granularity} data for ${beach.name}:`, error);
    }
  }
}

