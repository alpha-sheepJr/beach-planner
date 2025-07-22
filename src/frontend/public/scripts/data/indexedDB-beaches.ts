import { ISODateString } from "../../../../services/openMeteoService.js";
import { DailyWeatherData, DailyMarineData } from "../../../../data/get/forecastData.js";

interface BeachData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

class ForecastDB {
  private dbName = "application_database";
  private dbVersion = 4; // bump version if you already had v2

  // Fetch helper for beaches
  private async fetchBeaches(): Promise<BeachData[]> {
    const url = "/api/beach_data";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return (await response.json()) as BeachData[];
    } catch (error) {
      console.error("Fetch beaches error:", error);
      return [];
    }
  }

  // Fetch helper for daily weather
  private async fetchDailyWeather(): Promise<DailyWeatherData[]> {
    const url = "/api/daily_weather_data";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return (await response.json()) as DailyWeatherData[];
    } catch (error) {
      console.error("Fetch daily weather error:", error);
      return [];
    }
  }

  private async fetchDailyMarine(): Promise<DailyMarineData[]> {
    const url = "/api/daily_marine_data";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return (await response.json()) as DailyMarineData[];
    } catch (error) {
      console.error("Fetch daily marine error:", error);
      return [];
    }
  }

  // Create stores and populate with fetched data
  async initializeDatabase(): Promise<void> {
    const beaches = await this.fetchBeaches();
    const dailyWeather = await this.fetchDailyWeather();
    const dailyMarine = await this.fetchDailyMarine(); // ⬅️ Add this line

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject("Failed to open IndexedDB");

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("beaches")) {
          const beachesStore = db.createObjectStore("beaches", { keyPath: "id" });
          beachesStore.createIndex("name", "name", { unique: true });
          beachesStore.createIndex("latitude", "latitude", { unique: false });
          beachesStore.createIndex("longitude", "longitude", { unique: false });
        }

        if (!db.objectStoreNames.contains("daily_weather")) {
          const dailyWeatherStore = db.createObjectStore("daily_weather", { keyPath: "id" });
          dailyWeatherStore.createIndex("beach_id", "beach_id", { unique: false });
          dailyWeatherStore.createIndex("date", "date", { unique: false });
          dailyWeatherStore.createIndex("metrics", "metrics", { unique: false });
          dailyWeatherStore.createIndex("sunrise", "sunrise", { unique: false });
          dailyWeatherStore.createIndex("sunset", "sunset", { unique: false });
        }

        if (!db.objectStoreNames.contains("daily_marine")) {
          const dailyMarineStore = db.createObjectStore("daily_marine", { keyPath: "id" });
          dailyMarineStore.createIndex("beach_id", "beach_id", { unique: false });
          dailyMarineStore.createIndex("date", "date", { unique: false });
          dailyMarineStore.createIndex("metrics", "metrics", { unique: false });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(["beaches", "daily_weather", "daily_marine"], "readwrite"); // ⬅️ Include daily_marine

        const beachesStore = tx.objectStore("beaches");
        beaches.forEach((beach) => beachesStore.put(beach));

        const dailyWeatherStore = tx.objectStore("daily_weather");
        dailyWeather.forEach((item) => dailyWeatherStore.put(item));

        const dailyMarineStore = tx.objectStore("daily_marine");
        dailyMarine.forEach((item) => dailyMarineStore.put(item)); // ⬅️ Add this line

        tx.oncomplete = () => {
          db.close();
          resolve();
        };

        tx.onerror = () => {
          reject("Failed to populate stores");
        };
      };
    });
  }


  getAllBeaches(): Promise<BeachData[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject("Failed to open IndexedDB");

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("beaches", "readonly");
        const store = tx.objectStore("beaches");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => resolve(getAllRequest.result as BeachData[]);
        getAllRequest.onerror = () => reject("Failed to retrieve beaches");
      };
    });
  }

  getAllDailyWeather(): Promise<DailyWeatherData[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject("Failed to open IndexedDB");

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("daily_weather", "readonly");
        const store = tx.objectStore("daily_weather");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => resolve(getAllRequest.result as DailyWeatherData[]);
        getAllRequest.onerror = () => reject("Failed to retrieve daily weather data");
      };
    });
  }

  getAllDailyMarine(): Promise<DailyMarineData[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject("Failed to open IndexedDB");

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("daily_marine", "readonly");
        const store = tx.objectStore("daily_marine");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => resolve(getAllRequest.result as DailyMarineData[]);
        getAllRequest.onerror = () => reject("Failed to retrieve daily marine data");
      };
    });
  }
}



// Usage example:

const db = new ForecastDB();

db.initializeDatabase()
  .then(() => {
    console.log("DB initialized and populated");

    return Promise.all([db.getAllBeaches(), db.getAllDailyWeather(), db.getAllDailyMarine()]);
  })
  .then(([beaches, dailyWeather, dailyMarine]) => {
    console.log("Beaches:", beaches);
    console.log("Daily Weather Data:", dailyWeather);
    console.log("Daily Marine Data:", dailyMarine);
  })
  .catch((error) => {
    console.error("IndexedDB error:", error);
  });
