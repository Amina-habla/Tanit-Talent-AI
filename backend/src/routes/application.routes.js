const express = require('express');
const {
  applyToJob,
  getJobApplications,
  getMyApplications
} = require('../controllers/application.controller');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/my', protect, authorize('CANDIDATE'), getMyApplications);
router.post('/:jobId', protect, authorize('CANDIDATE'), upload.single('cv'), applyToJob);
router.get('/:jobId', protect, authorize('RECRUITER'), getJobApplications);

module.exports = router;
