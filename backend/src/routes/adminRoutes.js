const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAdminJobs,
  updateJobModerationStatus,
  getReports,
  updateReportStatus,
  createReport
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Report submission allowed for any authenticated user
router.post('/reports', protect, createReport);

// All other admin routes strictly restricted to 'admin'
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAdminJobs);
router.put('/jobs/:id/status', updateJobModerationStatus);

router.get('/reports', getReports);
router.put('/reports/:id', updateReportStatus);

module.exports = router;
