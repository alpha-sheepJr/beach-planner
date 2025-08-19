export class ForecastDB {
    constructor() {
        this.dbName = "application_database";
        this.dbVersion = 11;
        /*
        // --- Read Methods ---
        private getAllFromStore<T>(storeName: string): Promise<T[]> {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject("Failed to open IndexedDB");
            request.onsuccess = () => {
              const db = request.result;
              const tx = db.transaction(storeName, "readonly");
              const store = tx.objectStore(storeName);
              const getAllRequest = store.getAll();
              getAllRequest.onsuccess = () => resolve(getAllRequest.result as T[]);
              getAllRequest.onerror = () => reject("Failed to retrieve data from " + storeName);
            };
          });
        }
      
        getAllBeaches(): Promise<BeachData[]> {
          return this.getAllFromStore<BeachData>("beaches");
        } */
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
    createObjectStore(db, name, options, indexes = []) {
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
        // Fetch everything in parallel
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
                // Only one store: beaches, with autoIncrement id
                this.createObjectStore(db, "beaches", { keyPath: "id", autoIncrement: true });
            };
            request.onsuccess = async () => {
                try {
                    // Build each beach record with all forecasts
                    const beachesRecords = beaches.map(beach => ({
                        name: beach.name,
                        latitude: beach.latitude,
                        longitude: beach.longitude,
                        daily_weather: dailyWeather.filter(r => r.beach_id === beach.id),
                        hourly_weather: hourlyWeather.filter(r => r.beach_id === beach.id),
                        daily_marine: dailyMarine.filter(r => r.beach_id === beach.id),
                        hourly_marine: hourlyMarine.filter(r => r.beach_id === beach.id)
                    }));
                    // Store all beaches
                    await this.storeRecords("beaches", beachesRecords);
                    resolve();
                }
                catch (err) {
                    reject("Failed to populate beaches: " + err);
                }
            };
        });
    }
}
/*

// --- Read Methods ---
  private getAllFromStore<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => reject("Failed to open IndexedDB");
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolve(getAllRequest.result as T[]);
        getAllRequest.onerror = () => reject("Failed to retrieve data from " + storeName);
      };
    });
  }

  getAllBeaches(): Promise<BeachData[]> {
    return this.getAllFromStore<BeachData>("beaches");
  }

  getAllDailyWeather(): Promise<DailyWeatherData[]> {
    return this.getAllFromStore<DailyWeatherData>("daily_weather");
  }

  getAllDailyMarine(): Promise<DailyMarineData[]> {
    return this.getAllFromStore<DailyMarineData>("daily_marine");
  }

  getAllHourlyWeather(): Promise<HourlyWeatherData[]> {
    return this.getAllFromStore<HourlyWeatherData>("hourly_weather");
  }

  getAllHourlyMarine(): Promise<HourlyMarineData[]> {
    return this.getAllFromStore<HourlyMarineData>("hourly_marine");
  }

*/ 
