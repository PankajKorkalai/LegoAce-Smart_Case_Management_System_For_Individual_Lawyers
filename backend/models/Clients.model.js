const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  initials: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['individual', 'corporate'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    default: '' 
  },
  address: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  activeCases: { 
    type: Number, 
    default: 0 
  },
  totalCases: { 
    type: Number, 
    default: 0 
  },
  lastContact: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  cases: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Case' 
  }],
  documents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Document' 
  }],
  activities: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Activity' 
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);