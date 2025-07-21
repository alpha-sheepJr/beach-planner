import db from './DB.js'
import { DailyWeatherRow, HourlyWeatherRow, HourlyMarineRow, DailyMarineRow } from "../services/openMeteoService.js";

export const store = {
    hourly: {
        weather(beachId: number, date: string, data: HourlyWeatherRow) {
            const insert = db.prepare(`
                INSERT OR REPLACE INTO hourly_weather (
                beach_id, date,
                temperature_2m, precipitation_probability,
                cloud_cover, wind_speed_10m,
                wind_direction
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            const insertMany = db.transaction(() => {
                for (let i = 0; i < data.time.length; i++) {
                    insert.run(
                        beachId,
                        data.time[i].toISOString(),
                        data.temperature2m[i],
                        data.precipitationProbability[i],
                        data.cloudCover[i],
                        data.windSpeed10m[i],
                        data.windDirection10m[i]
                    );
                }
            });

            insertMany(); // 🔁 Actually runs the transaction
        },
        marine(beachId: number, _: string, data: HourlyMarineRow) {
            const insert = db.prepare(`
                INSERT OR REPLACE INTO hourly_marine (
                beach_id, date,
                wave_height, sea_surface_temperature,
                ocean_current_velocity, ocean_current_direction,
                sea_level_height_msl,
                swell_wave_height, swell_wave_period
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const insertMany = db.transaction(() => {
                for (let i = 0; i < data.time.length; i++) {
                insert.run(
                    beachId,
                    data.time[i].toISOString(),
                    data.waveHeight[i],
                    data.seaSurfaceTemperature[i],
                    data.oceanCurrentVelocity[i],
                    data.oceanCurrentDirection[i],
                    data.seaLevelHeightMs1[i],
                    data.swellWaveHeight[i],
                    data.swellWavePeriod[i]
                );
                }
            });

            insertMany(); 
        }
    },
    daily: {
        weather(beachId: number, date: string, data: DailyWeatherRow) {
              db.prepare(`
                INSERT OR REPLACE INTO daily_weather (
                beach_id, date,
                temperature2m_max, temperature2m_min,
                precipitation_sum, precipitation_probability_max,
                wind_speed_10m_max, uv_index_max,
                sunrise, sunset
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                beachId,
                date,
                data.temperature2mMax[0],
                data.temperature2mMin[0],
                data.precipitationSum[0],
                data.precipitationProbabilityMax[0],
                data.windSpeed10mMax[0],
                data.uvIndexMax[0],
                data.sunrise[0].toISOString(),
                data.sunset[0].toISOString()
            );
        },
        marine(beachId: number, date: string, data: DailyMarineRow) {
              db.prepare(`
                INSERT OR REPLACE INTO daily_marine (
                beach_id, date, wave_height_max
                ) VALUES (?, ?, ?)
            `).run(
                beachId,
                date,
                data.waveHeightMax[0],
            );
        }
    }
}