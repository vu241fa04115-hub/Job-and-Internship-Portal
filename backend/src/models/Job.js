const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required']
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recruiter reference is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  workplaceType: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'Remote'
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: [true, 'Job type is required']
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level / Fresher', 'Mid Level', 'Senior Level', 'Internship'],
    default: 'Entry Level / Fresher'
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  salaryRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['yearly', 'monthly', 'hourly', 'stipend'], default: 'yearly' }
  },
  stipendText: {
    type: String,
    default: ''
  },
  duration: {
    type: String, // e.g. "3 months", "6 months" (useful for internships)
    default: ''
  },
  openings: {
    type: Number,
    default: 1,
    min: 1
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  eligibilityCriteria: {
    type: String,
    default: ''
  },
  responsibilities: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft', 'flagged'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ category: 1, jobType: 1, status: 1 });
jobSchema.index({ recruiterId: 1 });
jobSchema.index({ companyId: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
