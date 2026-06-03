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
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role, enrollmentId, department } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      enrollmentId,
      department
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email. Please enter a valid registered email.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please enter the correct password.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Authenticate administration login with unique ID/password
// @access  Public
router.post('/admin-login', async (req, res) => {
  const { adminId, password } = req.body;
  try {
    const targetId = process.env.ADMIN_ID || 'admin_usis';
    const targetPassword = process.env.ADMIN_PASSWORD || 'admin_pass_987';

    if (adminId !== targetId) {
      return res.status(401).json({ message: 'Incorrect Admin Security ID. Please enter the correct ID.' });
    }

    if (password !== targetPassword) {
      return res.status(401).json({ message: 'Incorrect Master Access Password. Please enter the correct password.' });
    }

    res.json({
      _id: 'admin_master_123',
      name: 'System Administrator',
      email: 'admin@usis.edu',
      role: 'admin',
      token: generateToken('admin_master_123', 'admin'),
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
