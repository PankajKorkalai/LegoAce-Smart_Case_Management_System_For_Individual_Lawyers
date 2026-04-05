const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: { 
    type: String, 
    enum: ['meeting', 'call', 'email'], 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  clientId: { 
    type: String, 
    ref: 'Client',
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);