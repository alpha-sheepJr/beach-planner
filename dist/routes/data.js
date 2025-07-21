import { Router } from 'express';
import { getBeachesController } from '../controllers/data.js';
const router = Router();
router.get('/beach_data', getBeachesController);
export default router;
