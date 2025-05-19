import express from 'express';
import {
    generatePipelineAnalytics,
    getLatestAnalytics,
    getDashboardAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/generate', generatePipelineAnalytics);
router.get('/latest', getLatestAnalytics);
router.get('/dashboard', getDashboardAnalytics);

export default router;