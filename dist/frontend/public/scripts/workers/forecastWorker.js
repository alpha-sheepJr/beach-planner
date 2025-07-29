import { ForecastDB } from '../data/forecastDB.js';
const db = new ForecastDB();
self.onmessage = async (event) => {
    const { type } = event.data;
    if (type === "initialize") {
        try {
            await db.initializeDatabase();
            self.postMessage({ type: "complete", success: true });
        }
        catch (err) {
            self.postMessage({ type: "error", message: err instanceof Error ? err.message : String(err) });
        }
    }
};
