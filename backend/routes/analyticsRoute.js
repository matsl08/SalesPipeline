import express from 'express';
import {
    generatePipelineAnalytics,
    getLatestAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/generate', generatePipelineAnalytics);
router.get('/latest', getLatestAnalytics);

export default router;