import { Router } from 'express';
import { getBeachesController, getDailyWeatherController } from '../controllers/data.js';
const router = Router();
router.get('/beach_data', getBeachesController);
router.get('/daily_weather_data', getDailyWeatherController);
export default router;
