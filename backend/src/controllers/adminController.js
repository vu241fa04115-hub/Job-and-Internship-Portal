const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Report = require('../models/Report');

// @desc    Get Admin dashboard analytics & statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalInternships,
      totalApplications,
      pendingReportsCount
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments({ jobType: { $ne: 'Internship' } }),
      Job.countDocuments({ jobType: 'Internship' }),
      Application.countDocuments(),
      Report.countDocuments({ status: 'pending' })
    ]);

    // Aggregate applications status breakdown
    const applicationStatusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Aggregate jobs by category
    const categoryStats = await Job.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // Aggregate jobs by workplace type
    const workplaceStats = await Job.aggregate([
      {
        $group: {
          _id: '$workplaceType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent registrations
    const recentUsers = await User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent applications
    const recentApplications = await Application.find()
      .populate('applicantId', 'name email profileImage')
      .populate('jobId', 'title')
      .populate('companyId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalInternships,
        totalApplications,
        pendingReports: pendingReportsCount
      },
      charts: {
        applicationStatus: applicationStatusStats.map(s => ({ name: s._id, value: s.count })),
        categories: categoryStats.map(c => ({ name: c._id || 'Other', count: c.count })),
        workplace: workplaceStats.map(w => ({ name: w._id || 'Remote', count: w.count }))
      },
      recentUsers,
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, filter, pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: pageNumber
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (active / suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or suspended.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Protect super admin from self-suspension
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own admin status.'
      });
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: `User account has been set to ${status}.`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.'
      });
    }

    // Cascade delete user applications or jobs
    if (user.role === 'recruiter') {
      const jobs = await Job.find({ recruiterId: user._id }, '_id');
      const jobIds = jobs.map(j => j._id);
      await Promise.all([
        Job.deleteMany({ recruiterId: user._id }),
        Application.deleteMany({ jobId: { $in: jobIds } }),
        Company.deleteMany({ recruiterId: user._id })
      ]);
    } else {
      await Application.deleteMany({ applicantId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin management
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAdminJobs = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }, { category: searchRegex }];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate('companyId', 'name logo')
        .populate('recruiterId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Job.countDocuments(query)
    ]);

    res.json({
      success: true,
      jobs,
      total: totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize),
      currentPage: pageNumber
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job moderation status (e.g. flag, approve, close)
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (Admin)
const updateJobModerationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'closed', 'flagged'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, closed, or flagged.'
      });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('companyId');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    res.json({
      success: true,
      message: `Job status updated to ${status}.`,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports & complaints
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email')
      .populate({
        path: 'jobId',
        select: 'title companyId',
        populate: { path: 'companyId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
const updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    await report.save();

    res.json({
      success: true,
      message: 'Report updated successfully.',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit report against a job (Students/Recruiters/Public)
// @route   POST /api/admin/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const { jobId, reason, details } = req.body;

    if (!reason || !details) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid reason and details for this report.'
      });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      jobId: jobId || undefined,
      reason,
      details
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your report has been submitted to portal administrators for review.',
      report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAdminJobs,
  updateJobModerationStatus,
  getReports,
  updateReportStatus,
  createReport
};
