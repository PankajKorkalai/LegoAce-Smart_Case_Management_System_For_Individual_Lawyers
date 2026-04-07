// backend/models/Calendar.model.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    enum: ['Court Hearing', 'Meeting', 'Deadline', 'Reminder', 'Mediation', 'Deposition', 'Filing', 'Other'],
    default: 'Meeting'
  },
  color: {
    type: String,
    enum: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
    default: 'blue'
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: ''
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  case: {
    type: String,
    default: ''
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'in-progress'],
    default: 'upcoming'
  },
  reminder: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: String,
    default: '15'
  },
  attendees: [{
    name: String,
    email: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  }],
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'none'
  },
  recurrenceEndDate: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Calendar', eventSchema);