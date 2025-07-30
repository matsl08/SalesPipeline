import React, { useState, useEffect } from 'react';
import '../AddDeal/AddDeal.css'; // Reuse the same CSS
import { updateDeal } from '../../services/dealService';

const EditDealForm = ({ onClose, setLeads, dealToEdit, category }) => {
  const [editedDeal, setEditedDeal] = useState({
    id: '',
    name: '',
    email: '',
    company: '',
    value: '',
    status: '',
    category: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with the deal data when component mounts
  useEffect(() => {
    if (dealToEdit) {
      setEditedDeal({
        id: dealToEdit.id || dealToEdit._id || '',
        _id: dealToEdit._id || dealToEdit.id || '',
        leadId: dealToEdit.leadId || '',
        name: dealToEdit.name || '',
        email: dealToEdit.email || '',
        company: dealToEdit.company || '',
        value: dealToEdit.value || '',
        status: category.toLowerCase() || '',
        category: dealToEdit.category || 'prospect',
        phone: dealToEdit.phone || '',
        notes: dealToEdit.notes || ''
      });
    }
  }, [dealToEdit, category]);

  const handleEditDeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Determine which ID to use for the update (prefer _id if available)
      const idToUse = editedDeal._id || editedDeal.id;

      if (!idToUse) {
        throw new Error('No valid ID found for this deal');
      }

      console.log('Updating deal with ID:', idToUse, 'Deal data:', editedDeal);

      // Call the updateDeal service function to persist changes to MongoDB
      const updatedDeal = await updateDeal(idToUse, editedDeal);

      // Update the local state
      setLeads(prev => {
        // Create a copy of the previous state
        const newLeads = { ...prev };

        // Find and remove the deal from its original category
        // Check for both id and _id to ensure we find the deal
        Object.keys(newLeads).forEach(cat => {
          newLeads[cat] = newLeads[cat].filter(deal => {
            // If either ID matches, filter it out (return false)
            if (editedDeal.id && (deal.id === editedDeal.id || deal._id === editedDeal.id)) {
              return false;
            }
            if (editedDeal._id && (deal.id === editedDeal._id || deal._id === editedDeal._id)) {
              return false;
            }
            return true;
          });
        });

        // Add the updated deal to the selected category
        const targetCategory = editedDeal.status.charAt(0).toUpperCase() + editedDeal.status.slice(1);
        if (!newLeads[targetCategory]) {
          newLeads[targetCategory] = [];
        }
        newLeads[targetCategory].push(updatedDeal);

        return newLeads;
      });

      onClose();
    } catch (error) {
      console.error('Error editing deal:', error);
      setError(error.message || 'Failed to update deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="deal-form-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3>Edit Deal</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleEditDeal}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editedDeal.name}
              onChange={(e) => setEditedDeal({...editedDeal, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editedDeal.email}
              onChange={(e) => setEditedDeal({...editedDeal, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={editedDeal.company}
              onChange={(e) => setEditedDeal({...editedDeal, company: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Deal Value</label>
            <input
              type="number"
              value={editedDeal.value}
              onChange={(e) => setEditedDeal({...editedDeal, value: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={editedDeal.status}
              onChange={(e) => setEditedDeal({...editedDeal, status: e.target.value})}
            >
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="cooked">Cooked</option>
            </select>
          </div>
          {/* <div className="form-group">
            <label>Category</label>
            <select
              value={editedDeal.category}
              onChange={(e) => setEditedDeal({...editedDeal, category: e.target.value})}
            >
              <option value="prospect">Prospect</option>
              <option value="client">Client</option>
              <option value="partner">Partner</option>
              <option value="other">Other</option>
            </select>
          </div> */}
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={editedDeal.phone}
              onChange={(e) => setEditedDeal({...editedDeal, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={editedDeal.notes}
              onChange={(e) => setEditedDeal({...editedDeal, notes: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
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

export default EditDealForm;
