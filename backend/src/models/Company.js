const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  industry: {
    type: String,
    trim: true,
    default: 'Technology'
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  size: {
    type: String,
    default: '50-200 employees'
  },
  founded: {
    type: String,
    default: '2020'
  }
}, {
  timestamps: true
});

companySchema.index({ recruiterId: 1 });
companySchema.index({ name: 'text', industry: 'text' });

module.exports = mongoose.model('Company', companySchema);
