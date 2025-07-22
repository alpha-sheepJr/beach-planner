import { Router } from 'express';
import { getBeachesController, getDailyWeatherController, getDailyMarineController, getHourlyWeatherController } from '../controllers/data.js';
import { get } from 'http';

const router = Router();

router.get('/beach_data', getBeachesController);

router.get('/daily_weather_data', getDailyWeatherController);

router.get('/daily_marine_data', getDailyMarineController);

router.get('/hourly_weather_data', getHourlyWeatherController);

// Add more routes as needed for other data endpoints
export default router;