const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getRecruiterApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

// Job Seeker routes
router.post('/apply/:jobId', protect, authorize('student'), uploadResume.single('resume'), applyForJob);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.put('/:id/withdraw', protect, authorize('student'), withdrawApplication);

// Recruiter / Admin routes
router.get('/recruiter/applicants', protect, authorize('recruiter', 'admin'), getRecruiterApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
