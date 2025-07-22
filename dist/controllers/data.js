import { getAllBeaches } from "../data/get/beachData.js";
import { getAllDailyWeather } from '../data/get/forecastData.js';
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
export function getDailyWeatherController(req, res) {
    try {
        const dailyWeather = getAllDailyWeather();
        if (!dailyWeather || dailyWeather.length === 0) {
            return res.status(404).json({ error: 'No daily weather data found' });
        }
        res.status(200).json(dailyWeather);
    }
    catch (err) {
        console.error('Failed to retrieve daily weather data:', err);
        res.status(500).json({ error: 'Failed to retrieve daily weather data' });
    }
}
