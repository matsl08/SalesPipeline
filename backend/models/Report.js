import mongoose from 'mongoose';

const MeetingDetailsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    duration: Number, // in minutes
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['discovery', 'proposal', 'negotiation', 'follow-up', 'other'],
        required: true
    },
    notes: String,
    actionItems: [{
        task: String,
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dueDate: Date,
        status: {
            type: String,
            enum: ['pending', 'completed', 'delayed'],
            default: 'pending'
        }
    }]
});

const ConversationLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    topic: String,
    summary: String,
    nextSteps: String,
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const ReportSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    type: {
        type: String,
        enum: ['status', 'conversion', 'value', 'meeting', 'activity'],
        required: true
    },
    status: {
        current: {
            type: String,
            enum: ['cold', 'warm', 'hot', 'cooked'],
            required: true
        },
        history: [{
            status: String,
            changedAt: { type: Date, default: Date.now },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    },
    meetings: [MeetingDetailsSchema],
    conversations: [ConversationLogSchema],
    metrics: {
        totalMeetings: Number,
        averageMeetingDuration: Number,
        lastContactDate: Date,
        nextScheduledContact: Date
    },
    filters: {
        dateRange: {
            from: Date,
            to: Date
        },
        categories: [String],
        assignedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    generatedAt: { type: Date, default: Date.now },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Pre-save middleware to update metrics
ReportSchema.pre('save', function(next) {
    if (this.meetings && this.meetings.length > 0) {
        this.metrics.totalMeetings = this.meetings.length;
        this.metrics.averageMeetingDuration = this.meetings.reduce((acc, meeting) => 
            acc + (meeting.duration || 0), 0) / this.meetings.length;
        
        const sortedMeetings = [...this.meetings].sort((a, b) => b.date - a.date);
        this.metrics.lastContactDate = sortedMeetings[0].date;
        
        const futureMeetings = sortedMeetings.filter(m => m.date > new Date());
        if (futureMeetings.length > 0) {
            this.metrics.nextScheduledContact = futureMeetings[futureMeetings.length - 1].date;
        }
    }
    next();
});

export default mongoose.model('Report', ReportSchema);