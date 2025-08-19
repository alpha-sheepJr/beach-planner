export interface BeachRecord {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  daily_weather: any[];
  hourly_weather: any[];
  daily_marine: any[];
  hourly_marine: any[];
}

export class ForecastDBReader {
  private db!: IDBDatabase;

  constructor(private dbName = 'application_database', private dbVersion = 11) {}

  /** Open the database */
  async open(): Promise<void> {
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /** Internal helper to get the full beach record */
  private async getBeach(beachId: number): Promise<BeachRecord | undefined> {
    const tx = this.db.transaction('beaches', 'readonly');
    const store = tx.objectStore('beaches');
    const req = store.get(beachId);
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result as BeachRecord | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Forecast getters ---
  async getDailyWeather(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.daily_weather ?? [];
  }

  async getHourlyWeather(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.hourly_weather ?? [];
  }

  async getDailyMarine(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.daily_marine ?? [];
  }

  async getHourlyMarine(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.hourly_marine ?? [];
  }

  // --- Metadata getters ---
  async getName(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.name ?? null;
  }

  async getLatitude(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.latitude ?? null;
  }

  async getLongitude(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.longitude ?? null;
  }

  async getId(beachId: number) {
    const beach = await this.getBeach(beachId);
    return beach?.id ?? null;
  }
}
