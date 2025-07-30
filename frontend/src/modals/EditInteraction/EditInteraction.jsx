import React, { useState, useEffect } from 'react';
import '../AddInteraction/AddInteraction.css'; // Reuse the same CSS

const EditInteractionForm = ({ onClose, setInteractions, interactionToEdit, interactionIndex }) => {
  const [editedInteraction, setEditedInteraction] = useState({
    date: '',
    type: '',
    notes: '',
    lead: '',
    participants: '',
    summary: '',
    outcome: '',
    nextSteps: '',
    followUpDate: ''
  });
  const [localLeads, setLocalLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize form with the interaction data when component mounts
  useEffect(() => {
    if (interactionToEdit) {
      console.log('Interaction to edit:', interactionToEdit);
      setEditedInteraction({
        _id: interactionToEdit._id || '',
        date: interactionToEdit.date || '',
        type: interactionToEdit.type?.toLowerCase() || '',
        notes: interactionToEdit.notes || '',
        lead: interactionToEdit.lead || '',
        participants: Array.isArray(interactionToEdit.participants) 
          ? interactionToEdit.participants.join(', ') 
          : interactionToEdit.participants || '',
        summary: interactionToEdit.summary || '',
        outcome: interactionToEdit.outcome || '',
        nextSteps: interactionToEdit.nextSteps || '',
        followUpDate: interactionToEdit.followUpDate || ''
      });
    }
  }, [interactionToEdit]);

  // Fetch leads for the dropdown
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/leads', {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        if (response.ok) {
          const data = await response.json();
          const leadsArray = Array.isArray(data) ? data : (data.leads || []);
          setLocalLeads(leadsArray);
        } else {
          // Use mock data if API is unavailable
          setLocalLeads([
            { _id: 'mock-1', name: 'John Smith', company: 'Acme Inc.' },
            { _id: 'mock-2', name: 'Sarah Johnson', company: 'Tech Solutions' },
            { _id: 'mock-3', name: 'Michael Brown', company: 'Global Services' },
            { _id: 'mock-4', name: 'Emily Davis', company: 'Innovative Systems' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
        // Use mock data if API call fails
        setLocalLeads([
          { _id: 'mock-1', name: 'John Smith', company: 'Acme Inc.' },
          { _id: 'mock-2', name: 'Sarah Johnson', company: 'Tech Solutions' },
          { _id: 'mock-3', name: 'Michael Brown', company: 'Global Services' },
          { _id: 'mock-4', name: 'Emily Davis', company: 'Innovative Systems' }
        ]);
      }
    };

    fetchLeads();
  }, []);

  const handleEditInteraction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format participants as array
      const formattedInteraction = {
        ...editedInteraction,
        participants: editedInteraction.participants.split(',').map(p => p.trim()).filter(p => p)
      };

      // Try to make API call if token exists
      const token = localStorage.getItem('token');
      let success = false;
      
      if (token && editedInteraction._id) {
        try {
          const response = await fetch(`http://localhost:3000/api/interactions/${editedInteraction._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formattedInteraction)
          });

          if (response.ok) {
            success = true;
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          // Continue with local update if API fails
        }
      }

      // Update the interactions state
      setInteractions(prev => {
        const newInteractions = [...prev];
        newInteractions[interactionIndex] = {
          ...newInteractions[interactionIndex],
          _id: editedInteraction._id,
          date: formattedInteraction.date,
          type: formattedInteraction.type.charAt(0).toUpperCase() + formattedInteraction.type.slice(1),
          notes: formattedInteraction.notes || formattedInteraction.summary,
          summary: formattedInteraction.summary,
          outcome: formattedInteraction.outcome,
          nextSteps: formattedInteraction.nextSteps,
          followUpDate: formattedInteraction.followUpDate,
          participants: formattedInteraction.participants,
          lead: formattedInteraction.lead
        };
        return newInteractions;
      });

      onClose();
    } catch (error) {
      console.error('Error editing interaction:', error);
    } finally {
      setLoading(false);
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
            <label>Lead</label>
            <select
              value={editedInteraction.lead}
              onChange={(e) => setEditedInteraction({...editedInteraction, lead: e.target.value})}
              required
            >
              <option value="">Select a lead</option>
              {localLeads.map(lead => (
                <option key={lead._id} value={lead._id}>
                  {lead.name} - {lead.company || ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Interaction Type</label>
            <select
              value={editedInteraction.type}
              onChange={(e) => setEditedInteraction({...editedInteraction, type: e.target.value})}
              required
            >
              <option value="">Select type</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="demo">Demo</option>
              <option value="proposal">Proposal</option>
            </select>
          </div>

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
            <label>Outcome</label>
            <select
              value={editedInteraction.outcome}
              onChange={(e) => setEditedInteraction({...editedInteraction, outcome: e.target.value})}
            >
              <option value="">Select outcome</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Participants</label>
            <input
              type="text"
              value={editedInteraction.participants}
              onChange={(e) => setEditedInteraction({...editedInteraction, participants: e.target.value})}
              placeholder="John Doe, Jane Smith"
            />
          </div>

          <div className="form-group">
            <label>Follow-up Date</label>
            <input
              type="date"
              value={editedInteraction.followUpDate}
              onChange={(e) => setEditedInteraction({...editedInteraction, followUpDate: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <label>Summary</label>
            <input
              type="text"
              value={editedInteraction.summary}
              onChange={(e) => setEditedInteraction({...editedInteraction, summary: e.target.value})}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={editedInteraction.notes}
              onChange={(e) => setEditedInteraction({...editedInteraction, notes: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <label>Next Steps</label>
            <textarea
              value={editedInteraction.nextSteps}
              onChange={(e) => setEditedInteraction({...editedInteraction, nextSteps: e.target.value})}
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

export default EditInteractionForm;
