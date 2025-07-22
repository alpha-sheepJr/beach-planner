import { Request, Response } from 'express';
import { getAllBeaches } from "../data/get/beachData.js";
import type { BeachData } from '../data/get/beachData.js';
import { getAllDailyWeather, getAllDailyMarine } from '../data/get/forecastData.js';
import type { DailyWeatherData, DailyMarineData } from '../data/get/forecastData.js';


export function getBeachesController(req: Request, res: Response) {
    try {
        const beaches: BeachData[] = getAllBeaches();
        res.status(200).json(beaches);
    } catch (err) {
        console.error('Failed to retrieve beaches:', err);
        res.status(500).json({ error: 'Failed to retrieve beach data' });
    }
}

export function getDailyWeatherController(req: Request, res: Response) {
    try {
        const dailyWeather: DailyWeatherData[] = getAllDailyWeather();
        if (!dailyWeather || dailyWeather.length === 0) {
            return res.status(404).json({ error: 'No daily weather data found' });
        }
        res.status(200).json(dailyWeather);
    } catch (err) {
        console.error('Failed to retrieve daily weather data:', err);
        res.status(500).json({ error: 'Failed to retrieve daily weather data' });
    }
}

export function getDailyMarineController(req: Request, res: Response) {
    try {
        const dailyMarine: DailyMarineData[] = getAllDailyMarine(); 
        if (!dailyMarine || dailyMarine.length === 0) {
            return res.status(404).json({ error: 'No daily marine data found' });
        }
        res.status(200).json(dailyMarine);
    } catch (err) {
        console.error('Failed to retrieve daily marine data:', err);
        res.status(500).json({ error: 'Failed to retrieve daily marine data' });
    }
}
