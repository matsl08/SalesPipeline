import Interaction from '../models/Interactions.js';
import mongoose from 'mongoose';

// Create a new interaction
export const createInteraction = async (req, res) => {
    try {
        // Validate request body
        const { lead, type, summary, details, outcome, followUpDate, nextSteps, notes } = req.body;

        if (!lead || !type || !summary) {
            return res.status(400).json({ 
                message: 'Missing required fields: lead, type, and summary are required'
            });
        }

        // Create new interaction without depending on req.user
        const interaction = new Interaction({
            lead,
            type,
            summary,
            details,
            outcome,
            followUpDate,
            nextSteps,
            notes,
            createdBy: req.user?._id || null // Make createdBy optional for now
        });

        const savedInteraction = await interaction.save();
        
        // Populate reference fields
        await savedInteraction.populate([
            { path: 'lead', select: 'name company email' },
            { path: 'createdBy', select: 'name email' }
        ]);

        res.status(201).json(savedInteraction);
    } catch (error) {
        console.error('Error creating interaction:', error);
        res.status(500).json({ 
            message: 'Error creating interaction', 
            error: error.message 
        });
    }
};

// Get all interactions
export const getInteractions = async (req, res) => {
    try {
        const interactions = await Interaction.find()
            .populate('lead')
            .populate('createdBy', 'name email');
        res.status(200).json(interactions);
    } catch (error) {
        console.error('Error fetching interactions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get interactions by lead ID
export const getInteractionsByLead = async (req, res) => {
    try {
        const { leadId } = req.params;
        const interactions = await Interaction.find({ lead: leadId })
            .populate('createdBy', 'name email')
            .sort({ date: -1 });
        res.status(200).json(interactions);
    } catch (error) {
        console.error('Error fetching lead interactions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get a single interaction by ID
export const getInteractionById = async (req, res) => {
    try {
        const { id } = req.params;
        const interaction = await Interaction.findById(id)
            .populate('lead')
            .populate('createdBy', 'name email');
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        res.status(200).json(interaction);
    } catch (error) {
        console.error('Error fetching interaction:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Update an interaction
export const updateInteraction = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInteraction = await Interaction.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        ).populate(['lead', 'createdBy']);
        
        if (!updatedInteraction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        res.status(200).json(updatedInteraction);
    } catch (error) {
        console.error('Error updating interaction:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Delete an interaction
export const deleteInteraction = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInteraction = await Interaction.findByIdAndDelete(id);
        if (!deletedInteraction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        res.status(200).json({ message: 'Interaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting interaction:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};