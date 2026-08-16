import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  registerForEvent 
} from '../controllers/eventController.js';

const router = express.Router();

// Helper middleware to optionally resolve req.user for public list queries
const optionalProtect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Fail silently and keep req.user unset for optional queries
    }
  }
  next();
};

// Public Routes
router.get('/', optionalProtect, getEvents);
router.get('/:id', getEventById);

// Protected Admin Routes
router.post('/', protect, adminMiddleware, createEvent);
router.put('/:id', protect, adminMiddleware, updateEvent);
router.delete('/:id', protect, adminMiddleware, deleteEvent);

// Student Registration
router.post('/:id/register', protect, registerForEvent);

export default router;
