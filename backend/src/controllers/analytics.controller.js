const Event = require('../models/Event');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Track a clickstream event
// @route   POST /api/analytics/track
// @access  Public/Private
exports.trackEvent = async (req, res) => {
  try {
    const { type, page, element, metadata } = req.body;
    
    const event = await Event.create({
      user: req.user ? req.user.id : null,
      type,
      page,
      element,
      metadata
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/analytics/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    // Simple event stats
    const recentEvents = await Event.find().sort('-timestamp').limit(10).populate('user', 'name');
    
    const eventCounts = await Event.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const pageViews = await Event.aggregate([
      { $match: { type: 'PAGE_VIEW' } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 7 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          jobs: totalJobs,
          applications: totalApplications
        },
        eventDistribution: eventCounts,
        pageViews,
        recentEvents
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
