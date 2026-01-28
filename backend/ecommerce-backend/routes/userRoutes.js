const express = require('express');
const router = express.Router();
const { 
    getProfile, 
    updateProfile, 
    updatePassword, 
    deleteAccount 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/users/profile
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
router.put('/profile', updateProfile);

// @route   PUT /api/users/password
router.put('/password', updatePassword);

// @route   DELETE /api/users/profile
router.delete('/profile', deleteAccount);

module.exports = router;
