const Job = require('../models/Job');
const Company = require('../models/Company');
const SavedJob = require('../models/SavedJob');
const Application = require('../models/Application');

// @desc    Get all jobs & internships with search, filter, pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      category,
      jobType,
      experienceLevel,
      workplaceType,
      location,
      skills,
      minSalary,
      featured,
      isInternship,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'active' };

    // Internship explicit filter
    if (isInternship === 'true') {
      query.jobType = 'Internship';
    } else if (isInternship === 'false') {
      query.jobType = { $ne: 'Internship' };
    } else if (jobType) {
      query.jobType = jobType;
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (workplaceType) {
      query.workplaceType = workplaceType;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minSalary) {
      query['salaryRange.min'] = { $gte: Number(minSalary) };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    // Text search in title, description, skills
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { requiredSkills: searchRegex },
        { category: searchRegex }
      ];
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'deadline') sortOptions = { applicationDeadline: 1 };
    else if (sort === 'salary_high') sortOptions = { 'salaryRange.max': -1 };
    else if (sort === 'salary_low') sortOptions = { 'salaryRange.min': 1 };
    else if (sort === 'views') sortOptions = { viewsCount: -1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate('companyId', 'name logo website industry location size')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Job.countDocuments(query)
    ]);

    // Check saved status & applied status if user logged in
    let savedJobIds = new Set();
    let appliedJobIds = new Set();

    if (req.user) {
      const [saved, applications] = await Promise.all([
        SavedJob.find({ userId: req.user._id }, 'jobId').lean(),
        Application.find({ applicantId: req.user._id }, 'jobId').lean()
      ]);
      savedJobIds = new Set(saved.map(s => s.jobId.toString()));
      appliedJobIds = new Set(applications.map(a => a.jobId.toString()));
    }

    const enhancedJobs = jobs.map(job => ({
      ...job,
      isSaved: savedJobIds.has(job._id.toString()),
      hasApplied: appliedJobIds.has(job._id.toString())
    }));

    res.json({
      success: true,
      count: enhancedJobs.length,
      total: totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize),
      currentPage: pageNumber,
      jobs: enhancedJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId')
      .populate('recruiterId', 'name email phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    // Increment views
    await Job.findByIdAndUpdate(job._id, { $inc: { viewsCount: 1 } });

    let isSaved = false;
    let hasApplied = false;
    let applicationStatus = null;

    if (req.user) {
      const [saved, application] = await Promise.all([
        SavedJob.findOne({ userId: req.user._id, jobId: job._id }),
        Application.findOne({ applicantId: req.user._id, jobId: job._id })
      ]);
      isSaved = !!saved;
      if (application) {
        hasApplied = true;
        applicationStatus = application.status;
      }
    }

    // Get similar jobs
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      category: job.category,
      status: 'active'
    })
      .populate('companyId', 'name logo location')
      .limit(3)
      .lean();

    res.json({
      success: true,
      job: {
        ...job.toObject(),
        isSaved,
        hasApplied,
        applicationStatus
      },
      similarJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job / internship posting
// @route   POST /api/jobs
// @access  Private (Recruiter / Admin)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      location,
      workplaceType,
      jobType,
      experienceLevel,
      requiredSkills,
      salaryRange,
      stipendText,
      duration,
      openings,
      applicationDeadline,
      eligibilityCriteria,
      responsibilities,
      requirements,
      benefits,
      featured,
      status
    } = req.body;

    // Determine companyId
    let companyId = req.body.companyId;
    if (!companyId) {
      const company = await Company.findOne({ recruiterId: req.user._id });
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'No company profile found for this recruiter. Please create a company profile first.'
        });
      }
      companyId = company._id;
    }

    const job = await Job.create({
      title: title.trim(),
      description,
      companyId,
      recruiterId: req.user._id,
      category,
      location,
      workplaceType: workplaceType || 'Remote',
      jobType,
      experienceLevel: experienceLevel || 'Entry Level / Fresher',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      salaryRange: salaryRange || { min: 0, max: 0, currency: 'USD', period: 'yearly' },
      stipendText: stipendText || '',
      duration: duration || '',
      openings: openings || 1,
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      eligibilityCriteria: eligibilityCriteria || '',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      featured: featured || false,
      status: status || 'active'
    });

    const populated = await Job.findById(job._id).populate('companyId');

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      job: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter owner / Admin)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    // Role check: recruiter must own job; admin can update any
    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update your own job postings.'
      });
    }

    const updateFields = { ...req.body };
    if (updateFields.requiredSkills && typeof updateFields.requiredSkills === 'string') {
      updateFields.requiredSkills = updateFields.requiredSkills.split(',').map(s => s.trim());
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    }).populate('companyId');

    res.json({
      success: true,
      message: 'Job posting updated successfully.',
      job: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter owner / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own job postings.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Cleanup associated applications and saved entries
    await Promise.all([
      Application.deleteMany({ jobId: req.params.id }),
      SavedJob.deleteMany({ jobId: req.params.id })
    ]);

    res.json({
      success: true,
      message: 'Job posting and associated applications removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's posted jobs with applicant statistics
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate('companyId', 'name logo')
      .sort({ createdAt: -1 })
      .lean();

    // Attach real applicant counts
    const jobIds = jobs.map(j => j._id);
    const applicantCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    applicantCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const jobsWithCounts = jobs.map(j => ({
      ...j,
      applicantCount: countMap[j._id.toString()] || 0
    }));

    res.json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
