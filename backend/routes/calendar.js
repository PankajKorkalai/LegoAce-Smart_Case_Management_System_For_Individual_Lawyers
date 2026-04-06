// backend/routes/calendar.js
const express = require('express');
const router = express.Router();
const Calendar = require('../models/Calendar.model');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET all events for a user
router.get('/calendar/events', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let query = { createdBy: req.userId };
    
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
    const event = await Calendar.findOne({ id: req.params.id, createdBy: req.userId });
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
      createdBy: req.userId
    });
    
    await newEvent.save();
    
    // If reminder is set, schedule email notification
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
      attendees
    } = req.body;
    
    const timeString = startTime && endTime ? `${startTime} - ${endTime}` : '';
    
    const updatedEvent = await Calendar.findOneAndUpdate(
      { id: req.params.id, createdBy: req.userId },
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
    
    const updatedEvent = await Calendar.findOneAndUpdate(
      { id: req.params.id, createdBy: req.userId },
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
    const deletedEvent = await Calendar.findOneAndDelete({ id: req.params.id, createdBy: req.userId });
    
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
    const events = await Calendar.find({
      createdBy: req.userId,
      reminder: true,
      reminderSent: false,
      date: { $gte: today },
      status: 'upcoming'
    }).sort({ date: 1, startTime: 1 });
    
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
    
    const total = await Calendar.countDocuments({ createdBy: req.userId });
    const upcoming = await Calendar.countDocuments({ 
      createdBy: req.userId, 
      status: 'upcoming',
      date: { $gte: today }
    });
    const completed = await Calendar.countDocuments({ 
      createdBy: req.userId, 
      status: 'completed' 
    });
    const cancelled = await Calendar.countDocuments({ 
      createdBy: req.userId, 
      status: 'cancelled' 
    });
    const thisWeek = await Calendar.countDocuments({
      createdBy: req.userId,
      date: { $gte: today, $lte: nextWeekStr },
      status: 'upcoming'
    });
    
    // Get events by type
    const byType = await Calendar.aggregate([
      { $match: { createdBy: req.userId } },
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
  // This would integrate with a job scheduler like node-cron or bull
  // For now, we'll just log it
  console.log(`Reminder scheduled for event: ${event.title} on ${event.date}`);
};

module.exports = router;