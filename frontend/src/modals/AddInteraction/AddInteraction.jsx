import React, { useState, useEffect } from 'react';
import './AddInteraction.css';


const AddInteractionForm = ({ onClose, setInteractions, leads = [] }) => {
  // If leads are not provided as props, we'll use the state to fetch them
  const [localLeads, setLocalLeads] = useState([]);
  const [newInteraction, setNewInteraction] = useState({
    lead: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    participants: '',
    summary: '',
    notes: '',
    outcome: '',
    nextSteps: '',
    followUpDate: ''
  });

  // Fetch leads for the dropdown only if not provided as props
  useEffect(() => {
    // If leads are already provided as props, don't fetch
    if (leads && leads.length > 0) {
      return;
    }

    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leads`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        if (response.ok) {
          const data = await response.json();
          // Check if data is an array or has a leads property
          const leadsArray = Array.isArray(data) ? data : (data.leads || []);
          setLocalLeads(leadsArray);
        } else {
          // Use mock data if API is unavailable
          console.log('Using mock lead data');
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
  }, [leads]);

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      // Format participants as array
      const formattedInteraction = {
        ...newInteraction,
        participants: newInteraction.participants.split(',').map(p => p.trim())
      };

      // Try to make API call if token exists
      const token = localStorage.getItem('token');
      let success = false;
      let data = null;

      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formattedInteraction)
          });

          if (response.ok) {
            data = await response.json();
            success = true;
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          // Continue with local update if API fails
        }
      }

      // If API call failed or no token, create a mock interaction
      if (!success) {
        console.log('Using local interaction data');
        data = {
          _id: 'local-' + Date.now(),
          date: formattedInteraction.date,
          type: formattedInteraction.type,
          notes: formattedInteraction.notes || formattedInteraction.summary,
          summary: formattedInteraction.summary,
          outcome: formattedInteraction.outcome,
          nextSteps: formattedInteraction.nextSteps,
          followUpDate: formattedInteraction.followUpDate,
          createdAt: new Date().toISOString()
        };
      }

      // Update interactions list with the new interaction
      setInteractions(prev => [...prev, {
        date: data.date,
        type: data.type.charAt(0).toUpperCase() + data.type.slice(1), // Capitalize first letter
        notes: data.notes || data.summary
      }]);

      onClose();

      // Reset form
      setNewInteraction({
        lead: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        participants: '',
        summary: '',
        notes: '',
        outcome: '',
        nextSteps: '',
        followUpDate: ''
      });
    } catch (error) {
      console.error('Error adding interaction:', error);
      // Even if there's an error, close the form to prevent blank page
      onClose();
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
        <h3>Add New Interaction</h3>
        <form onSubmit={handleAddInteraction}>
          <div className="form-group">
            <label>Lead</label>
            <select
              value={newInteraction.lead}
              onChange={(e) => setNewInteraction({...newInteraction, lead: e.target.value})}
              required
            >
              <option value="">Select a lead</option>
              {/* Use either the props leads or the locally fetched leads */}
              {(leads.length > 0 ? leads : localLeads).map(lead => (
                <option key={lead._id} value={lead._id}>
                  {lead.name} - {lead.company || ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Interaction Type</label>
            <select
              value={newInteraction.type}
              onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
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
              value={newInteraction.date}
              onChange={(e) => setNewInteraction({...newInteraction, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Outcome</label>
            <select
              value={newInteraction.outcome}
              onChange={(e) => setNewInteraction({...newInteraction, outcome: e.target.value})}
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
              value={newInteraction.participants}
              onChange={(e) => setNewInteraction({...newInteraction, participants: e.target.value})}
              placeholder="John Doe, Jane Smith"
            />
          </div>

          <div className="form-group">
            <label>Follow-up Date</label>
            <input
              type="date"
              value={newInteraction.followUpDate}
              onChange={(e) => setNewInteraction({...newInteraction, followUpDate: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <label>Summary</label>
            <input
              type="text"
              value={newInteraction.summary}
              onChange={(e) => setNewInteraction({...newInteraction, summary: e.target.value})}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={newInteraction.notes}
              onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <label>Next Steps</label>
            <textarea
              value={newInteraction.nextSteps}
              onChange={(e) => setNewInteraction({...newInteraction, nextSteps: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Interaction</button>
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

export default AddInteractionForm;