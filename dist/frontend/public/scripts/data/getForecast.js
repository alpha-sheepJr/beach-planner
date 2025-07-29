export function openForecastDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('forecastDB', 1);
        request.onupgradeneeded = (event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains('forecastData')) {
                const objectStore = db.createObjectStore('forecastData', {
                    keyPath: 'id', autoIncrement: true,
                });
                objectStore.createIndex('beach_granularity_type', ['beachId', 'granularity', 'type']);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
export function getForecastData(db, beachId, granularity, types = ['weather', 'marine']) {
    const tx = db.transaction('forecastData', 'readonly');
    const store = tx.objectStore('forecastData');
    const index = store.index('beach_granularity_type');
    // Use Promise.all to fetch all combinations in parallel
    const requests = types.map((type) => {
        return new Promise((resolve, reject) => {
            const req = index.getAll([beachId, granularity, type]);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    });
    // Combine all results into one array
    return Promise.all(requests).then((results) => results.flat());
}
