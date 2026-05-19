const express = require('express');
const { trackEvent, getStats } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Middleware to optionally add user if logged in
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/track', optionalProtect, trackEvent);
router.get('/stats', protect, getStats);

module.exports = router;
