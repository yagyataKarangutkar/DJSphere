import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (clubAdmin or superAdmin)
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, category, maxParticipants, clubName } = req.body;
    
    // Basic validation
    if (!title || !description || !date || !time || !venue || !category || !maxParticipants) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (Number(maxParticipants) <= 0) {
      return res.status(400).json({ message: 'Maximum participants must be a positive number' });
    }

    const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
    
    // Enforce club admin context
    let finalClubName = clubName;
    if (!isSuper) {
      finalClubName = req.user.clubName;
    } else if (!finalClubName) {
      return res.status(400).json({ message: 'Please specify a club name for the event' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      category,
      maxParticipants: Number(maxParticipants),
      clubName: finalClubName,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (filtered by club admin context if in admin table)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const isAdminMode = req.query.admin === 'true';

    // If query.admin is true, the user is requesting within the admin dashboard
    if (isAdminMode) {
      // Must be authenticated to view admin context
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
      if (isSuper) {
        const events = await Event.find().sort({ date: 1 });
        return res.status(200).json({ success: true, data: events });
      } else {
        const events = await Event.find({ clubName: req.user.clubName }).sort({ date: 1 });
        return res.status(200).json({ success: true, data: events });
      }
    }

    // Standard public/student query
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (clubAdmin or superAdmin)
export const updateEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, category, maxParticipants, clubName } = req.body;
    
    // Basic validation
    if (!title || !description || !date || !time || !venue || !category || !maxParticipants) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (Number(maxParticipants) <= 0) {
      return res.status(400).json({ message: 'Maximum participants must be a positive number' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
    
    // Access control: Club admin can only modify their own events
    if (!isSuper && event.clubName !== req.user.clubName) {
      return res.status(403).json({ message: 'Not authorized to modify this event' });
    }

    let finalClubName = event.clubName;
    if (isSuper && clubName) {
      finalClubName = clubName;
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;
    event.venue = venue;
    event.category = category;
    event.maxParticipants = Number(maxParticipants);
    event.clubName = finalClubName;

    await event.save();

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (clubAdmin or superAdmin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isSuper = req.user.role === 'superAdmin' || req.user.role === 'super_admin';
    
    // Access control: Club admin can only delete their own events
    if (!isSuper && event.clubName !== req.user.clubName) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a student for an event
// @route   POST /api/events/:id/register
// @access  Private (student role check handled dynamically)
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity
    if (event.registrationsCount >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is already fully booked' });
    }

    // Check if user is already registered for this event
    const alreadyRegistered = await Registration.findOne({
      studentEmail: req.user.email,
      eventName: event.title,
    });

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Create registration
    const registration = await Registration.create({
      studentName: req.user.name,
      studentEmail: req.user.email,
      eventName: event.title,
      clubName: event.clubName,
    });

    // Increment count
    event.registrationsCount += 1;
    await event.save();

    return res.status(201).json({
      success: true,
      message: 'Event registered successfully',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
