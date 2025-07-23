class ForecastDB {
    constructor() {
        this.dbName = "application_database";
        this.dbVersion = 8;
    }
    // --- Fetching ---
    async fetchData(endpoint, label) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            return await response.json();
        }
        catch (err) {
            console.error(`Fetch error (${label}):`, err);
            return [];
        }
    }
    async fetchBeaches() {
        return this.fetchData("/api/beach_data", "beaches");
    }
    async fetchForecastData(granularity, type) {
        return this.fetchData(`/api/${granularity}_${type}_data`, `${granularity} ${type}`);
    }
    
    // --- Store Creation ---
    createObjectStore(db, name, options, indexes) {
        if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, options);
            for (const { name: idxName, keyPath, options } of indexes) {
                store.createIndex(idxName, keyPath, options);
            }
        }
    }
    // --- Data Storer ---
    async storeRecords(storeName, records) {
        const db = await this.openDatabase();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        for (const item of records) {
            store.put(item);
        }
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
    // --- Open DB ---
    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
    // --- Initialize DB + Populate ---
    async initializeDatabase() {
        const [beaches, dailyWeather, dailyMarine, hourlyWeather, hourlyMarine] = await Promise.all([
            this.fetchBeaches(),
            this.fetchData("/api/daily_weather_data", "daily weather"),
            this.fetchData("/api/daily_marine_data", "daily marine"),
            this.fetchData("/api/hourly_weather_data", "hourly weather"),
            this.fetchData("/api/hourly_marine_data", "hourly marine")
        ]);
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject("Failed to open IndexedDB");
            request.onupgradeneeded = () => {
                const db = request.result;
                this.createObjectStore(db, "beaches", { keyPath: "id" }, [
                    { name: "name", keyPath: "name", options: { unique: true } },
                    { name: "latitude", keyPath: "latitude" },
                    { name: "longitude", keyPath: "longitude" }
                ]);
                const forecastStores = [
                    "daily_weather",
                    "daily_marine",
                    "hourly_weather",
                    "hourly_marine"
                ];
                for (const storeName of forecastStores) {
                    this.createObjectStore(db, storeName, { keyPath: "id" }, [
                        { name: "beach_id", keyPath: "beach_id" },
                        { name: "date", keyPath: "date" }
                    ]);
                }
            };
            request.onsuccess = async () => {
                try {
                    await this.storeRecords("beaches", beaches);
                    await this.storeRecords("daily_weather", dailyWeather);
                    await this.storeRecords("daily_marine", dailyMarine);
                    await this.storeRecords("hourly_weather", hourlyWeather);
                    await this.storeRecords("hourly_marine", hourlyMarine);
                    resolve();
                }
                catch (err) {
                    reject("Failed to populate stores: " + err);
                }
            };
        });
    }
    // --- Read Methods ---
    getAllFromStore(storeName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject("Failed to open IndexedDB");
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = () => resolve(getAllRequest.result);
                getAllRequest.onerror = () => reject("Failed to retrieve data from " + storeName);
            };
        });
    }
    getAllBeaches() {
        return this.getAllFromStore("beaches");
    }
    getAllDailyWeather() {
        return this.getAllFromStore("daily_weather");
    }
    getAllDailyMarine() {
        return this.getAllFromStore("daily_marine");
    }
    getAllHourlyWeather() {
        return this.getAllFromStore("hourly_weather");
    }
    getAllHourlyMarine() {
        return this.getAllFromStore("hourly_marine");
    }
}
// Usage example:
const db = new ForecastDB();
db.initializeDatabase()
    .then(() => {
    console.log("DB initialized and populated");
    return Promise.all([db.getAllBeaches(), db.getAllDailyWeather(), db.getAllDailyMarine(), db.getAllHourlyWeather(), db.getAllHourlyMarine]);
})
    .then(([beaches, dailyWeather, dailyMarine, hourlyMarine]) => {
    console.log("Beaches:", beaches);
    console.log("Daily Weather Data:", dailyWeather);
    console.log("Daily Marine Data:", dailyMarine);
    console.log("Hourly Weather Data:", hourlyMarine);
    console.log("Hourly Marine Data:", hourlyMarine);
})
    .catch((error) => {
    console.error("IndexedDB error:", error);
});