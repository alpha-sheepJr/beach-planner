import { getAllBeaches } from "../data/get/beachData.js";
export function getBeachesController(req, res) {
    try {
        const beaches = getAllBeaches();
        res.status(200).json(beaches);
    }
    catch (err) {
        console.error('Failed to retrieve beaches:', err);
        res.status(500).json({ error: 'Failed to retrieve beach data' });
    }
}
