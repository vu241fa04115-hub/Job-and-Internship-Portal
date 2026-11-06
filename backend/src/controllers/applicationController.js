const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Apply for a job or internship
// @route   POST /api/applications/apply/:jobId
// @access  Private (Job Seeker / Student)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    let resumeUrl = req.body.resumeUrl;

    // If file was uploaded with request
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active or accepting applications.'
      });
    }

    if (new Date(job.applicationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this position has passed.'
      });
    }

    // Check duplicate
    const existingApp = await Application.findOne({
      applicantId: req.user._id,
      jobId: job._id
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this opportunity.'
      });
    }

    // If no resume provided in request, check user's saved resume
    if (!resumeUrl) {
      const user = await User.findById(req.user._id);
      if (user.resumeUrl) {
        resumeUrl = user.resumeUrl;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Please provide or upload a resume to submit your application.'
        });
      }
    }

    const application = await Application.create({
      applicantId: req.user._id,
      jobId: job._id,
      companyId: job.companyId._id,
      recruiterId: job.recruiterId,
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: req.user._id,
          note: 'Application submitted by candidate.',
          changedAt: new Date()
        }
      ]
    });

    // Increment count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    // Send notification to recruiter
    await Notification.create({
      userId: job.recruiterId,
      title: 'New Applicant Received',
      message: `${req.user.name} applied for "${job.title}".`,
      type: 'application_received',
      link: `/recruiter/applicants?jobId=${job._id}`
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker / Student)
const getMyApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { applicantId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'jobId',
        select: 'title category location jobType workplaceType salaryRange openings applicationDeadline status',
        populate: {
          path: 'companyId',
          select: 'name logo industry'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Job Seeker)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    if (['Selected', 'Rejected', 'Withdrawn'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw an application that is already ${application.status.toLowerCase()}.`
      });
    }

    application.status = 'Withdrawn';
    application.statusHistory.push({
      status: 'Withdrawn',
      updatedBy: req.user._id,
      note: 'Withdrawn by candidate.',
      changedAt: new Date()
    });

    await application.save();

    // Decrement job count
    await Job.findByIdAndUpdate(application.jobId, { $inc: { applicationsCount: -1 } });

    res.json({
      success: true,
      message: 'Application withdrawn successfully.',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a recruiter's job(s)
// @route   GET /api/applications/recruiter/applicants
// @access  Private (Recruiter)
const getRecruiterApplicants = async (req, res, next) => {
  try {
    const { jobId, status, search } = req.query;
    const query = { recruiterId: req.user._id };

    if (jobId) {
      query.jobId = jobId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('applicantId', 'name email phone headline bio location skills education experience profileImage resumeUrl')
      .populate('jobId', 'title category jobType location')
      .sort({ createdAt: -1 });

    // Optional text search in applicant name or email
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(app => {
        const applicant = app.applicantId;
        if (!applicant) return false;
        return (
          applicant.name.toLowerCase().includes(searchLower) ||
          applicant.email.toLowerCase().includes(searchLower) ||
          (applicant.skills && applicant.skills.some(s => s.toLowerCase().includes(searchLower)))
        );
      });
    }

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant status (Applied, Under Review, Shortlisted, Interview, Selected, Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title')
      .populate('applicantId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    // Recruiter authorization check: must own the job or be admin
    if (req.user.role !== 'admin' && application.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update applications for your own postings.'
      });
    }

    const oldStatus = application.status;
    application.status = status;
    if (note) application.recruiterNotes = note;

    application.statusHistory.push({
      status,
      updatedBy: req.user._id,
      note: note || `Status updated to ${status}.`,
      changedAt: new Date()
    });

    await application.save();

    // Create notification for applicant!
    const jobTitle = application.jobId ? application.jobId.title : 'the position';
    await Notification.create({
      userId: application.applicantId._id,
      title: `Application Status: ${status}`,
      message: `Your application for "${jobTitle}" has been updated from ${oldStatus} to "${status}".${note ? ` Note: "${note}"` : ''}`,
      type: 'application_status',
      link: '/student/applications'
    });

    res.json({
      success: true,
      message: `Applicant status updated to ${status}. Candidate has been notified.`,
      application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getRecruiterApplicants,
  updateApplicationStatus
};
