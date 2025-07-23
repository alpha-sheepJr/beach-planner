import db from '../DB.js';
// --- getData Implementation ---
export function getData(beachId, granularity, type) {
    const table = `${granularity}_${type}`;
    const stmt = db.prepare(`
    SELECT * FROM ${table}
    WHERE beach_id = ?
    ORDER BY date ASC
  `);
    const raw = stmt.all(beachId);
    // Type narrowing
    if (granularity === "hourly" && type === "weather") {
        return raw;
    }
    else if (granularity === "hourly" && type === "marine") {
        return raw;
    }
    else if (granularity === "daily" && type === "weather") {
        return raw;
    }
    else {
        return raw;
    }
}
// --- getAllForecastData Implementation ---
export function getAllForecastData(granularity, type) {
    const table = `${granularity}_${type}`;
    const stmt = db.prepare(`
    SELECT * FROM ${table}
    ORDER BY date ASC
  `);
    const raw = stmt.all();
    // Type narrowing
    if (granularity === "hourly" && type === "weather") {
        return raw;
    }
    else if (granularity === "hourly" && type === "marine") {
        return raw;
    }
    else if (granularity === "daily" && type === "weather") {
        return raw;
    }
    else {
        return raw;
    }
}
