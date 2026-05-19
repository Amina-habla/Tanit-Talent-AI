const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name company');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company');

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
exports.createJob = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.recruiter = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Make sure user is recruiter
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Make sure user is recruiter
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
