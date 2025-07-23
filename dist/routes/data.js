import { Router } from 'express';
import { getBeachesController, getDailyWeatherController, getDailyMarineController, getHourlyWeatherController, getHourlyMarineController } from '../controllers/data.js';
const router = Router();
router.get('/beach_data', getBeachesController);
router.get('/daily_weather_data', getDailyWeatherController);
router.get('/daily_marine_data', getDailyMarineController);
router.get('/hourly_weather_data', getHourlyWeatherController);
router.get('/hourly_marine_data', getHourlyMarineController);
// Add more routes as needed for other data endpoints
export default router;
