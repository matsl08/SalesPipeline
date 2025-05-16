import React, { useState, useEffect } from 'react';
import '../AddInteraction/AddInteraction.css'; // Reuse the same CSS

const EditInteractionForm = ({ onClose, setInteractions, interactionToEdit, interactionIndex }) => {
  const [editedInteraction, setEditedInteraction] = useState({
    date: '',
    type: '',
    notes: '',
    name: '',
    email: '',
    company: '',
    value: '',
    status: 'cold',
    category: 'prospect',
    phone: ''
  });

  // Initialize form with the interaction data when component mounts
  useEffect(() => {
    if (interactionToEdit) {
      setEditedInteraction({
        date: interactionToEdit.date || '',
        type: interactionToEdit.type || '',
        notes: interactionToEdit.notes || '',
        name: interactionToEdit.name || '',
        email: interactionToEdit.email || '',
        company: interactionToEdit.company || '',
        value: interactionToEdit.value || '',
        status: interactionToEdit.status || 'cold',
        category: interactionToEdit.category || 'prospect',
        phone: interactionToEdit.phone || ''
      });
    }
  }, [interactionToEdit]);

  const handleEditInteraction = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would make an API call to update the interaction
      // For now, we'll just update the state locally
      setInteractions(prev => {
        const newInteractions = [...prev];
        newInteractions[interactionIndex] = {
          date: editedInteraction.date,
          type: editedInteraction.type,
          notes: editedInteraction.notes
        };
        return newInteractions;
      });

      onClose();
    } catch (error) {
      console.error('Error editing interaction:', error);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="interaction-form-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3>Edit Interaction</h3>
        <form onSubmit={handleEditInteraction}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={editedInteraction.date}
              onChange={(e) => setEditedInteraction({...editedInteraction, date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={editedInteraction.type}
              onChange={(e) => setEditedInteraction({...editedInteraction, type: e.target.value})}
              required
            >
              <option value="">Select a type</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="Demo">Demo</option>
              <option value="Proposal">Proposal</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={editedInteraction.notes}
              onChange={(e) => setEditedInteraction({...editedInteraction, notes: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Save Changes</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInteractionForm;
