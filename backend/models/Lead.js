import mongoose from "mongoose";
const LeadSchema = new mongoose.Schema({
  leadId: {
    type: Number, unique: true, default: () => 'LEAD-' + Math.random().toString(36).substr(2, 9).toUpperCase() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: { type: String, index: true },
  value: { type: Number, index: true },
  source: String,
  status: {
    type: String,
    enum: ['cold', 'warm', 'hot', 'cooked'],
    default: 'cold',
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
    ref: 'User',
    index: true
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

LeadSchema.pre('save', function(next) {
  // Auto-set probability based on status
  const statusProbabilities = {
    cold: 25,
    warm: 50,
    hot: 75,
    cooked: 100
  };
  this.probability = statusProbabilities[this.status] || 40;
  next();
});

// Add auto-incrementing leadId
LeadSchema.pre('save', async function(next) {
  if (!this.leadId) {
      const lastLead = await this.constructor.findOne({}, {}, { sort: { 'leadId': -1 } });
      this.leadId = lastLead ? lastLead.leadId + 1 : 1000; // Start from 1000
  }
  next();
});

export default mongoose.model('Lead', LeadSchema);