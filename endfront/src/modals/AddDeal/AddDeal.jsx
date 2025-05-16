import React, { useState, useEffect } from 'react';
import './AddDeal.css';
import { addDeal } from '../../services/dealService';

const AddDealForm = ({ onClose, setLeads }) => {
  const [newDeal, setNewDeal] = useState({
    name: '',
    email: '',
    company: '',
    value: '',
    status: 'Cold', // Match the case used in Pipeline.jsx
    category: 'prospect',
    probability: 25,
    phone: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update probability automatically when status changes
  useEffect(() => {
    const statusProbabilities = {
      Cold: 25,
      Warm: 50,
      Hot: 75,
      Cooked: 100
    };

    setNewDeal(prevDeal => ({
      ...prevDeal,
      probability: statusProbabilities[prevDeal.status] || 25
    }));
  }, [newDeal.status]);

  const handleAddDeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!newDeal.name.trim()) {
        throw new Error('Name is required');
      }

      if (!newDeal.email.trim()) {
        throw new Error('Email is required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newDeal.email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Submitting deal:', newDeal);

      // Use the dealService to add the deal
      const data = await addDeal(newDeal);

      console.log('Deal added successfully:', data);

      // Format the response for the UI
      const uiFormattedDeal = {
        ...data,
        id: data._id || `mock-${Date.now()}`, // Ensure id is available for draggable
        _id: data._id || `mock-${Date.now()}` // Ensure _id is available
      };

      // Update the leads state in the parent component
      setLeads(prev => {
        const status = newDeal.status; // Already capitalized for UI
        return {
          ...prev,
          [status]: [...(prev[status] || []), uiFormattedDeal]
        };
      });

      // Show success message (could add a toast notification here)
      console.log('Deal added successfully!');

      // Close the form
      onClose();

      // Reset form
      setNewDeal({
        name: '',
        email: '',
        company: '',
        value: '',
        status: 'Cold',
        category: 'prospect',
        probability: 25,
        phone: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding deal:', error);
      setError(error.message || 'Failed to add deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="deal-form-container" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Deal</h3>

        <form onSubmit={handleAddDeal}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={newDeal.name}
              onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
              required
              placeholder="Enter contact name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={newDeal.email}
              onChange={(e) => setNewDeal({...newDeal, email: e.target.value})}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={newDeal.phone}
              onChange={(e) => setNewDeal({...newDeal, phone: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={newDeal.company}
              onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={newDeal.status}
              onChange={(e) => setNewDeal({...newDeal, status: e.target.value})}
            >
              <option value="Cold">Cold</option>
              <option value="Warm">Warm</option>
              <option value="Hot">Hot</option>
              <option value="Cooked">Cooked</option>
            </select>
          </div>

          <div className="form-group">
            <label>Probability (%)</label>
            <input
              type="number"
              value={newDeal.probability}
              readOnly
              disabled
              className="probability-field"
            />
            <small className="field-note">Auto-calculated based on status</small>
          </div>

          <div className="form-group">
            <label>Deal Value ($)</label>
            <input
              type="number"
              value={newDeal.value}
              onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
              placeholder="Enter deal value"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={newDeal.category}
              onChange={(e) => setNewDeal({...newDeal, category: e.target.value})}
            >
              <option value="prospect">Prospect</option>
              <option value="client">Client</option>
              <option value="partner">Partner</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={newDeal.notes}
              onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
              placeholder="Enter any additional notes"
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Deal'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDealForm;