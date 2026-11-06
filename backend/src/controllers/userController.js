const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const path = require('path');
const fs = require('fs');

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      headline,
      bio,
      location,
      skills,
      education,
      experience,
      projects
    } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    if (skills && Array.isArray(skills)) {
      user.skills = skills.map(s => s.trim()).filter(Boolean);
    }

    if (education && Array.isArray(education)) {
      user.education = education;
    }

    if (experience && Array.isArray(experience)) {
      user.experience = experience;
    }

    if (projects && Array.isArray(projects)) {
      user.projects = projects;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user resume (PDF)
// @route   POST /api/users/resume
// @access  Private (Job Seeker / Student)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a PDF resume file.'
      });
    }

    const user = await User.findById(req.user._id);

    // Delete old resume file if exists
    if (user.resumeUrl) {
      const oldFilename = path.basename(user.resumeUrl);
      const oldPath = path.join(__dirname, '../../uploads/resumes', oldFilename);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Failed to delete old resume:', e.message);
        }
      }
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    user.resumeUrl = resumeUrl;
    user.resumeOriginalName = req.file.originalname;
    user.resumeUpdatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully.',
      resumeUrl,
      resumeOriginalName: user.resumeOriginalName,
      resumeUpdatedAt: user.resumeUpdatedAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user profile avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file.'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.profileImage && user.profileImage.startsWith('/uploads/profiles/')) {
      const oldFilename = path.basename(user.profileImage);
      const oldPath = path.join(__dirname, '../../uploads/profiles', oldFilename);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Failed to delete old avatar:', e.message);
        }
      }
    }

    const profileImage = `/uploads/profiles/${req.file.filename}`;
    user.profileImage = profileImage;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image updated successfully.',
      profileImage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile by ID (for recruiters/admin viewing applicants)
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public portal stats for homepage hero
// @route   GET /api/users/stats/public
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const [totalJobs, totalInternships, totalCompanies, totalApplications] = await Promise.all([
      Job.countDocuments({ jobType: { $ne: 'Internship' }, status: 'active' }),
      Job.countDocuments({ jobType: 'Internship', status: 'active' }),
      Company.countDocuments(),
      Application.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        activeJobs: totalJobs,
        activeInternships: totalInternships,
        partnerCompanies: totalCompanies,
        totalApplications: totalApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  uploadResume,
  uploadAvatar,
  getUserById,
  getPublicStats
};
