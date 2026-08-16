import mongoose from 'mongoose';
import Club from '../models/Club.js';

// @desc    Get all clubs with optional search and type filtering
// @route   GET /api/clubs
// @access  Public
export const getClubs = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (type && type !== 'All') {
      // support matching the types e.g. "Student Chapters", "Teams"
      query.type = type;
    }

    const clubs = await Club.find(query).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single club by ID or exact name
// @route   GET /api/clubs/:id
// @access  Public
export const getClubById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let club;

    if (mongoose.Types.ObjectId.isValid(id)) {
      club = await Club.findById(id);
    } else {
      // Treat parameter as exact name if not a valid ObjectId
      club = await Club.findOne({ name: { $regex: new RegExp('^' + id + '$', 'i') } });
    }

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    return res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    next(error);
  }
};
