const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  reason: {
    type: String,
    required: true,
    enum: ['Spam or misleading', 'Fraudulent opportunity', 'Discriminatory content', 'Expired or duplicate', 'Other']
  },
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

reportSchema.index({ status: 1 });
reportSchema.index({ jobId: 1 });

module.exports = mongoose.model('Report', reportSchema);
