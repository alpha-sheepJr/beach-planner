export class ForecastDBReader {
    constructor(dbName = 'application_database', dbVersion = 11) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }
    /** Open the database */
    async open() {
        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    /** Internal helper to get the full beach record */
    async getBeach(beachId) {
        const tx = this.db.transaction('beaches', 'readonly');
        const store = tx.objectStore('beaches');
        const req = store.get(beachId);
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    // --- Forecast getters ---
    async getDailyWeather(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.daily_weather ?? [];
    }
    async getHourlyWeather(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.hourly_weather ?? [];
    }
    async getDailyMarine(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.daily_marine ?? [];
    }
    async getHourlyMarine(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.hourly_marine ?? [];
    }
    // --- Metadata getters ---
    async getName(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.name ?? null;
    }
    async getLatitude(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.latitude ?? null;
    }
    async getLongitude(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.longitude ?? null;
    }
    async getId(beachId) {
        const beach = await this.getBeach(beachId);
        return beach?.id ?? null;
    }
}
