const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add some feedback text']
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    default: 'Neutral'
  },
  score: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
