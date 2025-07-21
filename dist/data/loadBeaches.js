import { readFile } from "fs/promises";
import path from "path";
import db from './DB.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function loadBeaches() {
    const filePath = path.resolve(__dirname, "../data/beaches.json");
    const json = await readFile(filePath, "utf-8");
    const raw = JSON.parse(json);
    const beaches = Object.entries(raw).map(([name, data]) => ({
        name,
        latitude: parseFloat(data.coordinates.north),
        longitude: -Math.abs(parseFloat(data.coordinates.west)), // Force west to be negative
    }));
    return beaches;
}
/* this imports the data (name, coordinates) into the sqlite database */
function getOrCreateBeachId(name, latitude, longitude) {
    const row = db.prepare("SELECT id FROM beaches WHERE name = ?").get(name);
    if (row)
        return row.id;
    const result = db
        .prepare("INSERT INTO beaches (name, latitude, longitude) VALUES (?, ?, ?)")
        .run(name, latitude, longitude);
    return result.lastInsertRowid;
}
export { loadBeaches, getOrCreateBeachId };
