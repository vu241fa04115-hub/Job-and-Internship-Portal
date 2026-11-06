const express = require('express');
const router = express.Router();
const {
  getMyCompany,
  updateMyCompany,
  uploadCompanyLogo,
  getCompanyById
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// Public route
router.get('/:id', getCompanyById);

// Recruiter routes
router.get('/profile/my-company', protect, authorize('recruiter', 'admin'), getMyCompany);
router.put('/profile/my-company', protect, authorize('recruiter', 'admin'), updateMyCompany);
router.post('/profile/my-company/logo', protect, authorize('recruiter', 'admin'), uploadImage.single('logo'), uploadCompanyLogo);

module.exports = router;
