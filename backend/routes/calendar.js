// backend/routes/calendar.js
const express = require('express');
const router = express.Router();
const Calendar = require('../models/Calendar.model');
const jwt = require('jsonwebtoken');

// Flexible middleware to verify token (won't block if testing without auth)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // Use JWT_KEY or JWT_SECRET based on your env setup
      const secret = process.env.JWT_KEY || process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.id || decoded._id;
    } catch (error) {
      console.error("JWT Verification Note: Token invalid or expired.");
    }
  }
  next();
};

// GET all events for a user  
router.get('/calendar/events', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    // If userId exists, filter by it. Otherwise fetch all (useful for dev)
    let query = {};
    if (req.userId) {
      query.createdBy = req.userId;
    }
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const events = await Calendar.find(query).sort({ date: 1, startTime: 1 });
    
    // Update event statuses based on current date
    const today = new Date().toISOString().split('T')[0];
    const updatedEvents = [];
    
    for (const event of events) {
      let needsUpdate = false;
      let newStatus = event.status;
      
      if (event.status === 'upcoming' && event.date < today) {
        newStatus = 'completed';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        event.status = newStatus;
        await event.save();
      }
      
      updatedEvents.push(event);
    }
    
    res.json(updatedEvents);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    res.status(500).json({ error: "Unable to fetch events." });
  }
});

// GET single event
router.get('/calendar/events/:id', verifyToken, async (req, res) => {
  try {
    let query = { id: req.params.id };
    if (req.userId) query.createdBy = req.userId;

    const event = await Calendar.findOne(query);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    res.status(500).json({ error: "Unable to fetch event." });
  }
});

// POST create new event
router.post('/calendar/events', verifyToken, async (req, res) => {
  try {
    const {
      title,
      tag,
      color,
      date,
      startTime,
      endTime,
      location,
      case: caseName,
      description,
      reminder,
      reminderTime,
      attendees,
      recurrence,
      recurrenceEndDate
    } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required." });
    }
    
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const timeString = startTime && endTime ? `${startTime} - ${endTime}` : '';
    
    // Determine color based on event type if not provided
    let eventColor = color;
    if (!eventColor) {
      const colorMap = {
        'Court Hearing': 'red',
        'Meeting': 'blue',
        'Deadline': 'yellow',
        'Reminder': 'purple',
        'Mediation': 'green',
        'Deposition': 'orange',
        'Filing': 'yellow',
        'Other': 'blue'
      };
      eventColor = colorMap[tag] || 'blue';
    }
    
    const newEvent = new Calendar({
      id: eventId,
      title,
      tag: tag || 'Meeting',
      color: eventColor,
      date,
      startTime: startTime || '',
      endTime: endTime || '',
      time: timeString,
      location: location || '',
      case: caseName || '',
      description: description || '',
      status: 'upcoming',
      reminder: reminder || false,
      reminderSent: false,
      reminderTime: reminderTime || '15',
      attendees: attendees || [],
      recurrence: recurrence || 'none',
      recurrenceEndDate: recurrenceEndDate || '',
      createdBy: req.userId || null // Save user if logged in
    });
    
    await newEvent.save();
    
    // If reminder is set, schedule email notification (Mocked)
    if (reminder && process.env.USER && process.env.PASS) {
      scheduleReminderEmail(newEvent);
    }
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Failed to create event:", error);
    res.status(500).json({ error: "Unable to create event." });
  }
});

// PUT update event
router.put('/calendar/events/:id', verifyToken, async (req, res) => {
  try {
    const {
      title,
      tag,
      color,
      date,
      startTime,
      endTime,
      location,
      case: caseName,
      description,
      status,
      reminder,
      reminderTime,
      attendees,
      recurrence
    } = req.body;
    
    const timeString = startTime && endTime ? `${startTime} - ${endTime}` : '';
    
    let query = { id: req.params.id };
    if (req.userId) query.createdBy = req.userId;

    const updatedEvent = await Calendar.findOneAndUpdate(
      query,
      {
        title,
        tag,
        color,
        date,
        startTime,
        endTime,
        time: timeString,
        location,
        case: caseName,
        description,
        status,
        reminder,
        reminderTime,
        attendees,
        recurrence,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    res.status(500).json({ error: "Unable to update event." });
  }
});

// PATCH update event status
router.patch('/calendar/events/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    let query = { id: req.params.id };
    if (req.userId) query.createdBy = req.userId;

    const updatedEvent = await Calendar.findOneAndUpdate(
      query,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event status:", error);
    res.status(500).json({ error: "Unable to update event status." });
  }
});

// DELETE event
router.delete('/calendar/events/:id', verifyToken, async (req, res) => {
  try {
    let query = { id: req.params.id };
    if (req.userId) query.createdBy = req.userId;

    const deletedEvent = await Calendar.findOneAndDelete(query);
    
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }
    
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Failed to delete event:", error);
    res.status(500).json({ error: "Unable to delete event." });
  }
});

// GET upcoming reminders
router.get('/calendar/reminders/upcoming', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let query = {
      reminder: true,
      reminderSent: false,
      date: { $gte: today },
      status: 'upcoming'
    };
    if (req.userId) query.createdBy = req.userId;

    const events = await Calendar.find(query).sort({ date: 1, startTime: 1 });
    res.json(events);
  } catch (error) {
    console.error("Failed to fetch reminders:", error);
    res.status(500).json({ error: "Unable to fetch reminders." });
  }
});

// GET statistics
router.get('/calendar/stats', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    let baseQuery = {};
    let matchQuery = {};
    if (req.userId) {
      baseQuery.createdBy = req.userId;
      matchQuery.createdBy = req.userId; // For aggregate
    }
    
    const total = await Calendar.countDocuments(baseQuery);
    const upcoming = await Calendar.countDocuments({ 
      ...baseQuery,
      status: 'upcoming',
      date: { $gte: today }
    });
    const completed = await Calendar.countDocuments({ 
      ...baseQuery,
      status: 'completed' 
    });
    const cancelled = await Calendar.countDocuments({ 
      ...baseQuery,
      status: 'cancelled' 
    });
    const thisWeek = await Calendar.countDocuments({
      ...baseQuery,
      date: { $gte: today, $lte: nextWeekStr },
      status: 'upcoming'
    });
    
    // Get events by type
    const byType = await Calendar.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$tag', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total,
      upcoming,
      completed,
      cancelled,
      thisWeek,
      byType
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({ error: "Unable to fetch statistics." });
  }
});

// Helper function to schedule reminder email
const scheduleReminderEmail = async (event) => {
  console.log(`Reminder scheduled for event: ${event.title} on ${event.date}`);
};

module.exports = router;