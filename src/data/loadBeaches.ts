import { readFile } from "fs/promises";
import path from "path";
import db from './DB.js';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* extract beach data from ./beaches.json
 *   beach name: {
 *     coordinates: { north: number, west: number }
 *   }
 */

interface RawBeachData {
  [beachName: string]: {
    coordinates: {
      north: string;  // needs to be parsed as float
      west: string;   // needs to be parsed as float
    };
  };
}

interface Beach {
  name: string;
  latitude: number;
  longitude: number;
}

async function loadBeaches(): Promise<Beach[]> {
  const filePath = path.resolve(__dirname, "../data/beaches.json");
  const json = await readFile(filePath, "utf-8");
  const raw: RawBeachData = JSON.parse(json);

  const beaches: Beach[] = Object.entries(raw).map(([name, data]) => ({
    name,
    latitude: parseFloat(data.coordinates.north),
    longitude: -Math.abs(parseFloat(data.coordinates.west)), // Force west to be negative
  }));

  return beaches;
}

/* this imports the data (name, coordinates) into the sqlite database */
function getOrCreateBeachId(name: string, latitude: number, longitude: number): number {
  const row = db.prepare("SELECT id FROM beaches WHERE name = ?").get(name) as { id: number } | undefined;
  if (row) return row.id;

  const result = db
    .prepare("INSERT INTO beaches (name, latitude, longitude) VALUES (?, ?, ?)")
    .run(name, latitude, longitude);
  return result.lastInsertRowid as number;
}

export { Beach, loadBeaches, getOrCreateBeachId };