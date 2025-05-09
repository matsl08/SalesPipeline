import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from '../controllers/leadController.js';

const router = express.Router();

// Routes
router.post('/', auth, createLead);
router.get('/', auth, getLeads);
router.get('/:id',  auth, getLeadById);  // Changed from /leads/:leadId to /:id
router.put('/:id', auth, updateLead);
router.patch('/:id', auth, updateLead);
router.delete('/:leadId',  auth, deleteLead);

export default router;