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

        // // Validate the lead before saving
        // const validationError = lead.validateSync();
        // if (validationError) {
        //     console.error('Validation error:', validationError);
        //     return res.status(400).json({
        //         message: 'Validation error',
        //         errors: validationError.errors
        //     });
        // }

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
        // Get ID from either URL parameter or request body
        const idFromParams = req.params.id;
        const { leadId } = req.body;

        console.log('Updating lead - ID from params:', idFromParams, 'ID from body:', leadId, 'Full body:', req.body); // Debug log

        // Try to find by MongoDB _id first if the param looks like a MongoDB ObjectId
        let query = {};
        if (idFromParams && idFromParams.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: idFromParams };
        } else if (leadId) {
            // If no valid MongoDB ID but we have leadId in body, use that
            query = { leadId: Number(leadId) };
        } else if (idFromParams) {
            // If param doesn't look like MongoDB ID but we have it, try as leadId
            query = { leadId: Number(idFromParams) };
        } else {
            // If we have neither, check if there's an id field in the body (frontend might be using id instead of leadId)
            if (req.body.id) {
                if (req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
                    query = { _id: req.body.id };
                } else {
                    query = { leadId: Number(req.body.id) };
                }
            } else {
                return res.status(400).json({
                    message: 'No valid ID provided for update'
                });
            }
        }

        console.log('Using query for update:', query);

        const updatedLead = await Lead.findOneAndUpdate(
            query,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('interactions assignedTo');

        if (!updatedLead) {
            return res.status(404).json({
                message: `Lead not found with the provided ID`
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
        const { id } = req.params;
        console.log('Delete request received for id:', id);

        let deletedLead = null;

        // First try to find by MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('Attempting to delete by MongoDB ObjectId');
            try {
                deletedLead = await Lead.findByIdAndDelete(id);
                if (deletedLead) {
                    console.log('Lead deleted successfully by ObjectId');
                }
            } catch (err) {
                console.log('Error deleting by ObjectId:', err.message);
            }
        }

        // If not found by ObjectId, try by numeric leadId
        if (!deletedLead) {
            const numericLeadId = Number(id);
            if (!isNaN(numericLeadId)) {
                console.log('Attempting to delete by numeric leadId:', numericLeadId);
                deletedLead = await Lead.findOneAndDelete({ leadId: numericLeadId });
                if (deletedLead) {
                    console.log('Lead deleted successfully by numeric leadId');
                }
            }
        }

        // If still not found, try as a string leadId (for mock IDs)
        if (!deletedLead && id.startsWith('mock-')) {
            console.log('Attempting to delete by mock ID');
            deletedLead = await Lead.findOneAndDelete({ _id: id });
            if (deletedLead) {
                console.log('Lead deleted successfully by mock ID');
            }
        }

        if (!deletedLead) {
            console.log('Lead not found for deletion with id:', id);
            return res.status(404).json({
                message: `Lead with ID ${id} not found`
            });
        }

        console.log('Lead deleted successfully:', deletedLead);
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