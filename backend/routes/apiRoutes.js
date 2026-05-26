const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private (Mentor)
router.post('/attendance', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const { studentId, date, subject, status } = req.body;
    const attendance = await Attendance.create({
      studentId,
      mentorId: req.user.id,
      date,
      subject,
      status
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/attendance/student/:id
// @desc    Get attendance for a student
// @access  Private
router.get('/attendance/student/:id', protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.id }).sort('-date');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/grades
// @desc    Enter grades
// @access  Private (Mentor)
router.post('/grades', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const { studentId, subject, marks, maxMarks } = req.body;
    const grade = await Grade.create({
      studentId,
      mentorId: req.user.id,
      subject,
      marks,
      maxMarks
    });
    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
