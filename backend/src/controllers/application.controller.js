const Application = require('../models/Application');
const Job = require('../models/Job');
const axios = require('axios');
const path = require('path');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
exports.applyToJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const candidateId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'Already applied for this job' });
    }

    // Get file path
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a CV' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      cvPath: req.file.filename
    });

    // Call AI Service for initial analysis
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
        cv_path: path.resolve(req.file.path),
        job_description: job.description
      });

      if (response.data) {
        application.aiScore = response.data.score || 0;
        application.aiRanking = response.data.ranking || 'Pending';
        await application.save();
      }
    } catch (aiError) {
      console.error('AI Service Error:', aiError.message);
      // We don't fail the application if AI fails
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all applications for a job (Recruiter only)
// @route   GET /api/applications/:jobId
// @access  Private (Recruiter)
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check if user is the recruiter for this job
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .sort({ aiScore: -1 }); // Rank by AI score

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get user applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
