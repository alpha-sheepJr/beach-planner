import { getAllBeaches } from "../data/get/beachData.js";
import { getAllForecastData } from '../data/get/forecastData.js';
// --- Beaches Controller ---
export function getBeachesController(req, res) {
    try {
        const beaches = getAllBeaches();
        res.status(200).json(beaches);
    }
    catch (err) {
        console.error('Failed to retrieve beaches:', err);
        res.status(500).json({ error: 'Failed to retrieve beach data' });
    }
}
// --- Forecast Factory Controller ---
function createForecastController(type, granularity, errorMsg, castFn // 👈 Added to help TS infer correct return type
) {
    return (_req, res) => {
        try {
            const data = castFn();
            if (!data || data.length === 0) {
                return res.status(404).json({ error: `No ${errorMsg} data found` });
            }
            res.status(200).json(data);
        }
        catch (err) {
            console.error(`Failed to retrieve ${errorMsg} data:`, err);
            res.status(500).json({ error: `Failed to retrieve ${errorMsg} data` });
        }
    };
}
// --- Forecast Controllers ---
export const getDailyWeatherController = createForecastController("daily", "weather", "daily weather", () => getAllForecastData("daily", "weather"));
export const getDailyMarineController = createForecastController("daily", "marine", "daily marine", () => getAllForecastData("daily", "marine"));
export const getHourlyWeatherController = createForecastController("hourly", "weather", "hourly weather", () => getAllForecastData("hourly", "weather"));
export const getHourlyMarineController = createForecastController("hourly", "marine", "hourly marine", () => getAllForecastData("hourly", "marine"));
