import mongoose from 'mongoose';

const InteractionSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'demo', 'proposal'],
    required: true
  },
  date: { type: Date, default: Date.now },
  participants: [String],
  summary: String,
  notes: String,
  outcome: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'scheduled']
  },
  nextSteps: String,
  followUpDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', InteractionSchema);