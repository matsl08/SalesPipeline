import Analytics from '../models/Analytics.js';
import Lead from '../models/Lead.js';
import Interaction from '../models/Interactions.js';

const debug = (message, data) => {
    console.log(`[Analytics] ${message}:`, data);
};
export const generatePipelineAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Validate required fields
        if (!startDate || !endDate) {
            return res.status(400).json({
                message: 'Start date and end date are required'
            });
        }

        // Validate date format
        const periodStart = new Date(startDate);
        const periodEnd = new Date(endDate);

        if (isNaN(periodStart.getTime()) || isNaN(periodEnd.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        debug('Generating analytics for period:', { startDate, endDate });

        // ... existing pipeline metrics code ...

        const analytics = new Analytics({
            periodStart,
            periodEnd,
            pipelineMetrics: {
                totalLeads,
                statusDistribution,
                conversionRates: {
                    coldToWarm: (statusDistribution.warm.count / statusDistribution.cold.count) * 100 || 0,
                    warmToHot: (statusDistribution.hot.count / statusDistribution.warm.count) * 100 || 0,
                    hotToCooked: (statusDistribution.cooked.count / statusDistribution.hot.count) * 100 || 0,
                    overall: (statusDistribution.cooked.count / totalLeads) * 100 || 0
                }
            },
            interactionMetrics: {
                totalInteractions,
                typeDistribution,
                outcomeDistribution
            },
            generatedBy: req.user._id
        });

        debug('Saving analytics...');
        await analytics.save();
        
        // Populate user details before sending response
        await analytics.populate('generatedBy', 'name email');
        
        debug('Analytics generated successfully');
        res.status(201).json(analytics);
    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ 
            message: 'Error generating analytics', 
            error: error.message 
        });
    }
};

export const getLatestAnalytics = async (req, res) => {
    try {
        const analytics = await Analytics.findOne()
            .sort({ createdAt: -1 })
            .populate('generatedBy', 'name email');
        
        if (!analytics) {
            return res.status(404).json({ message: 'No analytics found' });
        }
        
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};