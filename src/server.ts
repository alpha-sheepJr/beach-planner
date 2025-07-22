import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

import './data/initDB.js';
import { fetchAndCacheForecasts } from './data/weatherReports.js';
import { getData } from './data/get/forecastData.js';
import dataRoutes from "./routes/data.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'frontend/views'));
app.set('view engine', 'pug');

// Fix the static file path
app.use(express.static(path.join(__dirname, '../dist/frontend/public')));

// Add explicit root route (optional, but recommended)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/frontend/public/index.html'));
});

app.use('/api', dataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  await fetchAndCacheForecasts('daily');
  await fetchAndCacheForecasts('hourly');

  const beachId = 1;
  const forecastData = getData(1, "daily", "marine");
  console.log(`Daily Marine Forecast for Beach ID ${beachId}`);
  console.log(forecastData);
});