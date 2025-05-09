import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    pipelineMetrics: {
        totalLeads: Number,
        statusDistribution: {
            cold: { count: Number, percentage: Number },
            warm: { count: Number, percentage: Number },
            hot: { count: Number, percentage: Number },
            cooked: { count: Number, percentage: Number }
        },
        conversionRates: {
            coldToWarm: Number,
            warmToHot: Number,
            hotToCooked: Number,
            overall: Number
        },
        averageTimeInStage: {
            cold: Number,
            warm: Number,
            hot: Number,
            cooked: Number
        }
    },
    interactionMetrics: {
        totalInteractions: Number,
        typeDistribution: {
            call: { count: Number, percentage: Number },
            email: { count: Number, percentage: Number },
            meeting: { count: Number, percentage: Number },
            demo: { count: Number, percentage: Number },
            proposal: { count: Number, percentage: Number }
        },
        outcomeDistribution: {
            positive: { count: Number, percentage: Number },
            neutral: { count: Number, percentage: Number },
            negative: { count: Number, percentage: Number },
            scheduled: { count: Number, percentage: Number }
        }
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Analytics', AnalyticsSchema);