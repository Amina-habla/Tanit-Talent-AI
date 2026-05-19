const Review = require('../models/Review');
const axios = require('axios');

// @desc    Create a new review with sentiment analysis
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }

    let sentimentData = { score: 0, sentiment: 'Neutral' };

    // Call AI Service for sentiment analysis
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/sentiment`, { text });
      if (response.data.success) {
        sentimentData = {
          score: response.data.score,
          sentiment: response.data.sentiment
        };
      }
    } catch (aiError) {
      console.error('Sentiment Analysis Error:', aiError.message);
    }

    const review = await Review.create({
      user: req.user.id,
      text,
      ...sentimentData
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name').sort('-createdAt');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
