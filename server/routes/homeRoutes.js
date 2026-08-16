import express from 'express';
import { getHomeStats } from '../controllers/homeController.js';

const router = express.Router();

// Public route to get landing page stats
router.get('/', getHomeStats);

export default router;
