const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  cvPath: {
    type: String,
    required: [true, 'Please upload a CV']
  },
  aiScore: {
    type: Number,
    default: 0
  },
  aiRanking: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'Pending'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'shortlisted', 'rejected'],
    default: 'applied'
  }
}, {
  timestamps: true
});

// Prevent user from applying to the same job twice
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
