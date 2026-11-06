const Company = require('../models/Company');
const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');

// @desc    Get current recruiter's company profile
// @route   GET /api/companies/my-company
// @access  Private (Recruiter)
const getMyCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      // Auto create fallback if not exists
      company = await Company.create({
        name: `${req.user.name}'s Company`,
        recruiterId: req.user._id
      });
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current recruiter's company profile
// @route   PUT /api/companies/my-company
// @access  Private (Recruiter)
const updateMyCompany = async (req, res, next) => {
  try {
    const { name, description, website, industry, location, size, founded } = req.body;

    let company = await Company.findOne({ recruiterId: req.user._id });

    if (!company) {
      company = new Company({
        recruiterId: req.user._id,
        name: name || `${req.user.name}'s Company`
      });
    }

    if (name) company.name = name.trim();
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (industry !== undefined) company.industry = industry;
    if (location !== undefined) company.location = location;
    if (size !== undefined) company.size = size;
    if (founded !== undefined) company.founded = founded;

    await company.save();

    res.json({
      success: true,
      message: 'Company profile updated successfully.',
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo
// @route   POST /api/companies/my-company/logo
// @access  Private (Recruiter)
const uploadCompanyLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a logo image file.'
      });
    }

    let company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      company = new Company({
        recruiterId: req.user._id,
        name: `${req.user.name}'s Company`
      });
    }

    // Remove old logo if local
    if (company.logo && company.logo.startsWith('/uploads/profiles/')) {
      const oldFilename = path.basename(company.logo);
      const oldPath = path.join(__dirname, '../../uploads/profiles', oldFilename);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) {}
      }
    }

    company.logo = `/uploads/profiles/${req.file.filename}`;
    await company.save();

    res.json({
      success: true,
      message: 'Company logo uploaded successfully.',
      logo: company.logo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company details with active jobs (Public)
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.'
      });
    }

    const activeJobs = await Job.find({ companyId: company._id, status: 'active' })
      .select('title category jobType location salaryRange duration createdAt');

    res.json({
      success: true,
      company,
      activeJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCompany,
  updateMyCompany,
  uploadCompanyLogo,
  getCompanyById
};
