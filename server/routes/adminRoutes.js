import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminMiddleware, superAdminMiddleware } from '../middleware/adminMiddleware.js';
import { 
  getDashboardStats, 
  getAdminEvents, 
  getAdminRegistrations, 
  getAdminClubs, 
  createClub, 
  getAdminUsers 
} from '../controllers/adminController.js';

const router = express.Router();

// General Admin Routes (Club Admins and Super Admins)
router.get('/dashboard', protect, adminMiddleware, getDashboardStats);
router.get('/events', protect, adminMiddleware, getAdminEvents);
router.get('/registrations', protect, adminMiddleware, getAdminRegistrations);

// Super Admin Only Routes
router.get('/clubs', protect, superAdminMiddleware, getAdminClubs);
router.post('/clubs', protect, superAdminMiddleware, createClub);
router.get('/users', protect, superAdminMiddleware, getAdminUsers);

export default router;
