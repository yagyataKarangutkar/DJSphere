import express from 'express';
import { getClubs, getClubById } from '../controllers/clubController.js';

const router = express.Router();

router.get('/', getClubs);
router.get('/:id', getClubById);

export default router;
