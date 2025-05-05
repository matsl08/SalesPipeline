// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['status', 'conversion', 'value', 'custom'],
    required: true
  },
  filters: {
    dateRange: {
      from: Date,
      to: Date
    },
    statuses: [String],
    categories: [String],
    assignedTo: [mongoose.Schema.Types.ObjectId]
  },
  data: mongoose.Schema.Types.Mixed, // Store report results
  generatedAt: { type: Date, default: Date.now },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Report', ReportSchema);