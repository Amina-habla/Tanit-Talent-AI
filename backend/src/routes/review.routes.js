const express = require('express');
const { createReview, getReviews } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

module.exports = router;
