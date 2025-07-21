interface BeachData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export class ForecastDB {
  private dbName = "application_database";
  private dbVersion = 2;

  async createBeachesStore(): Promise<void> {
    const beachData: BeachData[] = [];

    async function getData(): Promise<BeachData[]> {
      const url = "/api/beach_data";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json as BeachData[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Fetch error:", error.message);
        } else {
          console.error("Unknown error during fetch");
        }
        return [];
      }
    }

    const fetchedData = await getData();
    beachData.push(...fetchedData);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject("Failed to open IndexedDB");

      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("beaches", { keyPath: "id" });

        store.createIndex("name", "name", { unique: true });
        store.createIndex("latitude", "latitude", { unique: false });
        store.createIndex("longitude", "longitude", { unique: false });

        store.transaction.oncomplete = () => {
          const tx = db.transaction("beaches", "readwrite");
          const objectStore = tx.objectStore("beaches");
          beachData.forEach((beach) => objectStore.add(beach));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject("Failed to populate beach store");
        };
      };

      request.onsuccess = () => {
        request.result.close();
        resolve();
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

        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result as BeachData[]);
        };

        getAllRequest.onerror = () => {
          reject("Failed to retrieve beaches");
        };
      };
    });
  }
}


const db = new ForecastDB();

db.createBeachesStore()
  .then(() => {
    console.log("Beaches store created and populated!");

    // Now try reading the data back:
    return db.getAllBeaches();
  })
  .then((beaches) => {
    console.log("Beaches retrieved from IndexedDB:", beaches);
  })
  .catch((error) => {
    console.error("Error with IndexedDB operations:", error);
  });