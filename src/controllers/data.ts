import { Request, Response } from 'express';
import { getAllBeaches } from "../data/get/beachData.js";
import type { BeachData } from '../data/get/beachData.js';

export function getBeachesController(req: Request, res: Response) {
    try {
        const beaches: BeachData[] = getAllBeaches();
        res.status(200).json(beaches);
    } catch (err) {
        console.error('Failed to retrieve beaches:', err);
        res.status(500).json({ error: 'Failed to retrieve beach data' });
    }
}