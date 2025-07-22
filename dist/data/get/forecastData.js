import db from '../DB.js';
// Implementation
export function getData(beachId, granularity, type) {
    const table = `${granularity}_${type}`;
    const stmt = db.prepare(`
    SELECT * FROM ${table}
    WHERE beach_id = ?
    ORDER BY date ASC
  `);
    const raw = stmt.all(beachId);
    return raw;
}
export function getAllDailyWeather() {
    const stmt = db.prepare(`
    SELECT * FROM daily_weather
    ORDER BY date ASC
  `);
    const raw = stmt.all();
    return raw;
}
export function getAllDailyMarine() {
    const stmt = db.prepare(`
    SELECT * FROM daily_marine
    ORDER BY date ASC
  `);
    const raw = stmt.all();
    return raw;
}
export function getAllHourlyWeather() {
    const stmt = db.prepare(`
    SELECT * FROM hourly_weather
    ORDER BY date ASC
  `);
    const raw = stmt.all();
    return raw;
}
