const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job or internship
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Job Seeker / Student)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    const existing = await SavedJob.findOne({
      userId: req.user._id,
      jobId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved to your bookmarks.'
      });
    }

    const saved = await SavedJob.create({
      userId: req.user._id,
      jobId
    });

    res.status(201).json({
      success: true,
      message: 'Job saved to your bookmarks.',
      savedJob: saved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Job Seeker / Student)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const result = await SavedJob.findOneAndDelete({
      userId: req.user._id,
      jobId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Saved job entry not found.'
      });
    }

    res.json({
      success: true,
      message: 'Job removed from your bookmarks.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Job Seeker / Student)
const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'name logo industry location'
        }
      })
      .sort({ createdAt: -1 });

    const validJobs = saved
      .filter(item => item.jobId !== null)
      .map(item => ({
        _id: item._id,
        savedAt: item.createdAt,
        job: item.jobId
      }));

    res.json({
      success: true,
      count: validJobs.length,
      savedJobs: validJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs
};
