import mongoose from 'mongoose';
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

export const getDashboardAnalytics = async (req, res) => {
    try {
        debug('Fetching dashboard analytics');

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected');
            return res.status(500).json({
                message: 'Database connection error',
                error: 'MongoDB not connected'
            });
        }

        // Get total sales (sum of lead values with status 'cooked')
        let salesData = [];
        try {
            salesData = await Lead.aggregate([
                { $match: { status: 'cooked' } },
                { $group: { _id: null, totalSales: { $sum: '$value' } } }
            ]);
        } catch (err) {
            console.error('Error aggregating sales data:', err);
            salesData = [];
        }

        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        // Get active leads count (all leads that are not 'cooked')
        let activeLeadsCount = 0;
        try {
            activeLeadsCount = await Lead.countDocuments({ status: { $ne: 'cooked' } });
        } catch (err) {
            console.error('Error counting active leads:', err);
        }

        // Get conversion rate (percentage of 'cooked' leads out of total leads)
        let totalLeadsCount = 0;
        let cookedLeadsCount = 0;
        try {
            totalLeadsCount = await Lead.countDocuments();
            cookedLeadsCount = await Lead.countDocuments({ status: 'cooked' });
        } catch (err) {
            console.error('Error counting leads for conversion rate:', err);
        }

        const conversionRate = totalLeadsCount > 0 ? (cookedLeadsCount / totalLeadsCount) * 100 : 0;

        // Get lead status distribution for analytics chart
        let statusDistribution = [];
        try {
            statusDistribution = await Lead.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { status: '$_id', count: 1, _id: 0 } }
            ]);
        } catch (err) {
            console.error('Error aggregating status distribution:', err);
            // Provide default status distribution if query fails
            statusDistribution = [
                { status: 'cold', count: 0 },
                { status: 'warm', count: 0 },
                { status: 'hot', count: 0 },
                { status: 'cooked', count: 0 }
            ];
        }

        // Ensure all statuses are represented in the distribution
        const allStatuses = ['cold', 'warm', 'hot', 'cooked'];
        const existingStatuses = statusDistribution.map(item => item.status);

        allStatuses.forEach(status => {
            if (!existingStatuses.includes(status)) {
                statusDistribution.push({ status, count: 0 });
            }
        });

        debug('Dashboard analytics data prepared', {
            totalSales,
            activeLeads: activeLeadsCount,
            conversionRate,
            statusDistribution
        });

        res.status(200).json({
            totalSales,
            activeLeads: activeLeadsCount,
            conversionRate,
            statusDistribution
        });
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({
            message: 'Error fetching dashboard analytics',
            error: error.message
        });
    }
};