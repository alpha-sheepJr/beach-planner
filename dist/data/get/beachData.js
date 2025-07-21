import db from '../DB.js';
export function getAllBeaches() {
    return db.prepare('SELECT * FROM beaches').all();
}
