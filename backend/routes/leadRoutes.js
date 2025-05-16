import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from '../controllers/leadController.js';

const router = express.Router();

// Routes - removed auth middleware to make them accessible without authentication
router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);  // Changed from /leads/:leadId to /:id
router.put('/:id', updateLead);
router.patch('/:id', updateLead);
router.delete('/:leadId', deleteLead);

export default router;