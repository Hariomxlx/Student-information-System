const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretjwtkey_for_usis_app', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (Mocked for Demo)
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Mock user creation
    res.status(201).json({
      _id: 'mock_user_123',
      name: name || 'Demo User',
      email: email || 'demo@usis.edu',
      role: role || 'student',
      token: generateToken('mock_user_123', role || 'student'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Mocked for Demo)
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Mock user login
    res.json({
      _id: 'mock_user_123',
      name: 'Demo User',
      email: email || 'demo@usis.edu',
      role: 'student',
      token: generateToken('mock_user_123', 'student'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
