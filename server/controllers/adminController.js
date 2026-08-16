import User from '../models/User.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get admin dashboard stats and charts
// @route   GET /api/admin/dashboard
// @access  Private (clubAdmin or superAdmin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
    const clubName = req.user.clubName;

    let stats = {};
    let recentEvents = [];
    let registrationsOverview = [];

    if (isSuper) {
      // Global stats
      const totalEvents = await Event.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalRegistrations = await Registration.countDocuments();
      const activeClubs = await Club.countDocuments();

      stats = {
        totalEvents,
        totalUsers,
        totalRegistrations,
        activeClubs,
      };

      // 4 recent events
      recentEvents = await Event.find().sort({ createdAt: -1 }).limit(4);

      // Group registrations by eventName
      const allRegs = await Registration.find();
      const distribution = {};
      allRegs.forEach((r) => {
        distribution[r.eventName] = (distribution[r.eventName] || 0) + 1;
      });
      registrationsOverview = Object.keys(distribution).map((name) => ({
        name,
        value: distribution[name],
      }));
    } else {
      // Club specific stats
      const totalEvents = await Event.countDocuments({ clubName });
      const totalRegistrations = await Registration.countDocuments({ clubName });
      
      // Count unique users registered to this club's events
      const clubRegs = await Registration.find({ clubName });
      const uniqueEmails = new Set(clubRegs.map((r) => r.studentEmail));
      const totalUsers = uniqueEmails.size;
      const activeClubs = 1;

      stats = {
        totalEvents,
        totalUsers,
        totalRegistrations,
        activeClubs,
      };

      // 4 recent events of the club
      recentEvents = await Event.find({ clubName }).sort({ createdAt: -1 }).limit(4);

      // Group registrations of this club by eventName
      const distribution = {};
      clubRegs.forEach((r) => {
        distribution[r.eventName] = (distribution[r.eventName] || 0) + 1;
      });
      registrationsOverview = Object.keys(distribution).map((name) => ({
        name,
        value: distribution[name],
      }));
    }

    return res.status(200).json({
      success: true,
      data: {
        stats,
        recentEvents,
        registrationsOverview,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin events (filtered for club admin)
// @route   GET /api/admin/events
// @access  Private (clubAdmin or superAdmin)
export const getAdminEvents = async (req, res, next) => {
  try {
    const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
    const clubName = req.user.clubName;

    let events;
    if (isSuper) {
      events = await Event.find().sort({ date: 1 });
    } else {
      events = await Event.find({ clubName }).sort({ date: 1 });
    }

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin registrations (filtered for club admin)
// @route   GET /api/admin/registrations
// @access  Private (clubAdmin or superAdmin)
export const getAdminRegistrations = async (req, res, next) => {
  try {
    const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
    const clubName = req.user.clubName;

    let registrations;
    if (isSuper) {
      registrations = await Registration.find().sort({ registeredOn: -1 });
    } else {
      registrations = await Registration.find({ clubName }).sort({ registeredOn: -1 });
    }

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin clubs
// @route   GET /api/admin/clubs
// @access  Private (superAdmin only)
export const getAdminClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: clubs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a club
// @route   POST /api/admin/clubs
// @access  Private (superAdmin only)
export const createClub = async (req, res, next) => {
  try {
    const { name, type, members } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Please provide name and type' });
    }

    const newClub = await Club.create({
      name,
      type,
      members: Number(members) || 0,
    });

    return res.status(201).json({
      success: true,
      data: newClub,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin users
// @route   GET /api/admin/users
// @access  Private (superAdmin only)
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
