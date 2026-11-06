const express = require('express');
const router = express.Router();
const {
  updateProfile,
  uploadResume,
  uploadAvatar,
  getUserById,
  getPublicStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadResume: resumeMulter, uploadImage: avatarMulter } = require('../middleware/upload');

// Public portal stats
router.get('/stats/public', getPublicStats);

// Protected routes
router.put('/profile', protect, updateProfile);
router.post('/resume', protect, resumeMulter.single('resume'), uploadResume);
router.post('/avatar', protect, avatarMulter.single('avatar'), uploadAvatar);
router.get('/:id', protect, getUserById);

module.exports = router;
