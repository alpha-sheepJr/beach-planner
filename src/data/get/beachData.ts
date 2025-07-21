import db from '../DB.js';

export interface BeachData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export function getAllBeaches(): BeachData[] {
    return db.prepare('SELECT * FROM beaches').all() as BeachData[];
}