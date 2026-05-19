const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['PAGE_VIEW', 'BUTTON_CLICK', 'AUTH_EVENT', 'APPLICATION_SUBMIT']
  },
  page: {
    type: String
  },
  element: {
    type: String
  },
  metadata: {
    type: Object
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
