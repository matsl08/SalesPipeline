
import mongoose from "mongoose";
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: { type: String, index: true },
  value: { type: Number, index: true },
  source: String,
  status: {
    type: String,
    enum: ['cold', 'warm', 'hot', 'cooked', 'rejected'],
    default: 'warm',
    index: true
  },
  category: {
    type: String,
    enum: ['prospect', 'client', 'partner', 'other']
  },
  probability: { type: Number, min: 0, max: 100 },
  lastContact: Date,
  nextFollowUp: Date,
  notes: String,
  interactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interaction'
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

LeadSchema.pre('save', function(next) {
  // Auto-set probability based on status
  const statusProbabilities = {
    cold: 10,
    warm: 40,
    hot: 75,
    cooked: 100,
    rejected: 0
  };
  this.probability = statusProbabilities[this.status] || 40;
  next();
});

module.exports = mongoose.model('Lead', LeadSchema);