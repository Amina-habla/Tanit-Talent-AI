const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/job.controller');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('RECRUITER'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('RECRUITER'), updateJob)
  .delete(protect, authorize('RECRUITER'), deleteJob);

module.exports = router;
