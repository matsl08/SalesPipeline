import Lead from '../models/Lead.js'; // Fix the typo in the import
import Interaction from '../models/Interactions.js'; // Assuming you have an Interaction model
import mongoose from 'mongoose';

// Create a new lead with transaction
export const createLead = async (req, res) => {
    try {
        console.log('Creating lead with data:', req.body); // Debug log

        // Check if email already exists
        const existingLead = await Lead.findOne({ email: req.body.email });
        if (existingLead) {
            return res.status(400).json({
                message: 'Email already exists',
                field: 'email'
            });
        }

        const lead = new Lead(req.body);

        // Validate the lead before saving
        const validationError = lead.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
                message: 'Validation error',
                errors: validationError.errors
            });
        }

        const savedLead = await lead.save();
        console.log('Lead saved successfully:', savedLead); // Success log
        res.status(201).json(savedLead);
    } catch (error) {
        console.error('Error creating lead:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        res.status(500).json({
            message: 'Error creating lead',
            error: error.message
        });
    }
};
// Get all leads with pagination
export const getLeads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const leads = await Lead.find()
            .populate('interactions assignedTo')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Lead.countDocuments();

        res.status(200).json({
            leads,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get interactions by lead ID
export const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findOne({ leadId: Number(id) })
          .populate('interactions')
            .populate('assignedTo', 'name email');

        if (!lead) {
            return res.status(404).json({ 
                message: `Lead with ID ${id} not found` 
            });
        }

        res.status(200).json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ 
            message: 'Error fetching lead', 
            error: error.message 
        });
    }
};


// Update a lead with transaction
export const updateLead = async (req, res) => {
    try {
        const { leadId } = req.body;
        console.log('Updating lead:', leadId, req.body); // Debug log

        const updatedLead = await Lead.findOneAndUpdate(
            { leadId: Number(leadId) },
            req.body,
            { 
                new: true,
                runValidators: true 
            }
        ).populate('interactions assignedTo');

        if (!updatedLead) {
            return res.status(404).json({ 
                message: `Lead with ID ${leadId} not found` 
            });
        }

        console.log('Lead updated successfully:', updatedLead); // Success log
        res.status(200).json(updatedLead);
    } catch (error) {
        console.error('Error updating lead:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Error updating lead', 
            error: error.message 
        });
    }
};

// Delete a lead with transaction
export const deleteLead = async (req, res) => {
    try {
        const { leadId } = req.params;

        // Parse leadId as a number
        const numericLeadId = Number(leadId);

        // Ensure leadId is a valid number
        if (isNaN(numericLeadId)) {
            return res.status(400).json({
                message: 'Invalid leadId. It must be a number.'
            });
        }

        // Find lead by leadId (numeric)
        const deletedLead = await Lead.findOneAndDelete({ leadId: numericLeadId });

        if (!deletedLead) {
            return res.status(404).json({
                message: `Lead with ID ${numericLeadId} not found`
            });
        }

        res.status(200).json({
            message: 'Lead deleted successfully',
            deletedLead
        });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({
            message: 'Error deleting lead',
            error: error.message
        });
    }
};