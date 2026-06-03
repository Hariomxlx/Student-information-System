const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const { protect, authorize } = require('../middleware/auth');

// All admin routes are protected and only accessible by admin
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Private (Admin)
router.get('/stats', async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const mentorCount = await User.countDocuments({ role: 'mentor' });
    
    const totalGrievances = await Grievance.countDocuments();
    const pendingGrievances = await Grievance.countDocuments({ status: 'Pending' });
    const inProgressGrievances = await Grievance.countDocuments({ status: 'In Progress' });
    const resolvedGrievances = await Grievance.countDocuments({ status: 'Resolved' });
    const rejectedGrievances = await Grievance.countDocuments({ status: 'Rejected' });

    res.json({
      students: studentCount,
      mentors: mentorCount,
      grievances: {
        total: totalGrievances,
        pending: pendingGrievances,
        inProgress: inProgressGrievances,
        resolved: resolvedGrievances,
        rejected: rejectedGrievances
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all students and mentors
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'mentor'] } }).select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/users
// @desc    Create a student or mentor
// @access  Private (Admin)
router.post('/users', async (req, res) => {
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
      role,
      enrollmentId,
      department
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollmentId: user.enrollmentId,
      department: user.department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a student or mentor
// @access  Private (Admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/grievances/:id
// @desc    Update status and add official reply to a grievance
// @access  Private (Admin)
router.put('/grievances/:id', async (req, res) => {
  const { status, adminReply } = req.body;
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    grievance.status = status || grievance.status;
    grievance.adminReply = adminReply || grievance.adminReply;

    const updatedGrievance = await grievance.save();
    res.json(updatedGrievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
