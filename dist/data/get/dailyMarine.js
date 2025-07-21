import db from '../DB.js';
export function getDailyMarineByBeachID(beachId) {
    const stmt = db.prepare(`
    SELECT * FROM daily_marine
    WHERE beach_id = ?
    ORDER BY date ASC
  `);
    return stmt.all(beachId);
}
