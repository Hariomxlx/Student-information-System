const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  grade: { type: String }
}, { timestamps: true });

// Auto-calculate grade based on marks
GradeSchema.pre('save', function(next) {
  const percentage = (this.marks / this.maxMarks) * 100;
  if (percentage >= 90) this.grade = 'A';
  else if (percentage >= 80) this.grade = 'B';
  else if (percentage >= 70) this.grade = 'C';
  else if (percentage >= 60) this.grade = 'D';
  else this.grade = 'F';
  next();
});

module.exports = mongoose.model('Grade', GradeSchema);
