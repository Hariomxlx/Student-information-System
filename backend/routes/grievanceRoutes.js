const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/grievances
// @desc    Submit a new grievance
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const grievance = await Grievance.create({
      student: req.user.id,
      title,
      description,
      category
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/grievances
// @desc    Get user's grievances or all grievances if admin
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let grievances;
    
    if (req.user.role === 'admin' || req.user.role === 'mentor') {
      grievances = await Grievance.find().populate('student', 'name email enrollmentId').sort('-createdAt');
    } else {
      grievances = await Grievance.find({ student: req.user.id }).populate('student', 'name email enrollmentId').sort('-createdAt');
    }
    
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/grievances/:id/status
// @desc    Update grievance status
// @access  Private (Admin/Mentor)
router.put('/:id/status', protect, authorize('admin', 'mentor'), async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status, adminReply },
      { new: true, runValidators: true }
    );
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
