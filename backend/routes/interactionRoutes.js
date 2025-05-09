import express from 'express';
import {
    createInteraction,
    getInteractions,
    getInteractionsByLead,
    getInteractionById,
    updateInteraction,
    deleteInteraction
} from '../controllers/interactionsController.js';

const router = express.Router();

router.post('/', createInteraction);
router.get('/', getInteractions);
router.get('/lead/:leadId', getInteractionsByLead);
router.get('/:id', getInteractionById);
router.put('/:id', updateInteraction);
router.delete('/:id', deleteInteraction);

export default router;