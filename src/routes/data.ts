import { Router } from 'express';
import { getBeachesController, getDailyWeatherController, getDailyMarineController } from '../controllers/data.js';

const router = Router();

router.get('/beach_data', getBeachesController);

router.get('/daily_weather_data', getDailyWeatherController);

router.get('/daily_marine_data', getDailyMarineController);

export default router;