import { ISODateString } from "../../../../services/openMeteoService.js";
import {
  DailyWeatherData,
  DailyMarineData,
  HourlyWeatherData,
  HourlyMarineData
} from "../../../../data/get/forecastData.js";

interface BeachData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

type ForecastStoreName =
  | "daily_weather"
  | "hourly_weather"
  | "daily_marine"
  | "hourly_marine";

export class ForecastDB {
  dbName = "application_database";
  dbVersion = 8;

  // --- Fetching ---
  private async fetchData(endpoint: string, label: string): Promise<any[]> {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`Fetch error (${label}):`, err);
      return [];
    }
  }

  async fetchBeaches(): Promise<BeachData[]> {
    return this.fetchData("/api/beach_data", "beaches");
  }

  async fetchForecastData(
    granularity: "daily" | "hourly",
    type: "weather" | "marine"
  ): Promise<any[]> {
    return this.fetchData(`/api/${granularity}_${type}_data`, `${granularity} ${type}`);
  }

  // --- Store Creation ---
  private createObjectStore(
    db: IDBDatabase,
    name: string,
    options: IDBObjectStoreParameters,
    indexes: { name: string; keyPath: string | string[]; options?: IDBIndexParameters }[]
  ) {
    if (!db.objectStoreNames.contains(name)) {
      const store = db.createObjectStore(name, options);
      for (const { name: idxName, keyPath, options } of indexes) {
        store.createIndex(idxName, keyPath, options);
      }
    }
  }

  // --- Data Storer ---
  private async storeRecords<T = any>(storeName: string, records: T[]): Promise<void> {
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
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // --- Initialize DB + Populate ---
  async initializeDatabase(): Promise<void> {
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

        const forecastStores: ForecastStoreName[] = [
          "daily_weather",
          "daily_marine",
          "hourly_weather",
          "hourly_marine"
        ];

        for (const storeName of forecastStores) {
          this.createObjectStore(
            db,
            storeName,
            { keyPath: "id" },
            [
              { name: "beach_id", keyPath: "beach_id" },
              { name: "date", keyPath: "date" }
            ]
          );
        }
      };

      request.onsuccess = async () => {
        try {
          await this.storeRecords("beaches", beaches);
          await this.storeRecords("daily_weather", dailyWeather as DailyWeatherData[]);
          await this.storeRecords("daily_marine", dailyMarine as DailyMarineData[]);
          await this.storeRecords("hourly_weather", hourlyWeather as HourlyWeatherData[]);
          await this.storeRecords("hourly_marine", hourlyMarine as HourlyMarineData[]);
          resolve();
        } catch (err) {
          reject("Failed to populate stores: " + err);
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