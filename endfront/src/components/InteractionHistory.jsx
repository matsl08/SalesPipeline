import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Interactions.css';
import AddInteractionForm from '../modals/AddInteraction/AddInteraction';
import EditInteractionForm from '../modals/EditInteraction/EditInteraction';


const InteractionHistory = ({ leadName }) => {
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(-1);
  const [interactions, setInteractions] = useState([
    { date: '2025-05-01', type: 'Call', notes: 'Discussed the new product.' },
    { date: '2025-05-02', type: 'Email', notes: 'Followed up on the proposal.' },
    { date: '2025-05-03', type: 'Meeting', notes: 'Meeting to finalize the contract.' },
  ]);
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  // Fetch leads for the interaction form
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
          // Check if data is an array or has a leads property
          const leadsArray = Array.isArray(data) ? data : (data.leads || []);
          setLeads(leadsArray);
        } else {
          // Use mock data if API is unavailable
          console.log('Using mock lead data for interactions');
          setLeads([
            { _id: 'mock-1', name: 'John Smith', company: 'Acme Inc.' },
            { _id: 'mock-2', name: 'Sarah Johnson', company: 'Tech Solutions' },
            { _id: 'mock-3', name: 'Michael Brown', company: 'Global Services' },
            { _id: 'mock-4', name: 'Emily Davis', company: 'Innovative Systems' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching leads for interactions:', error);
        // Use mock data if API call fails
        setLeads([
          { _id: 'mock-1', name: 'John Smith', company: 'Acme Inc.' },
          { _id: 'mock-2', name: 'Sarah Johnson', company: 'Tech Solutions' },
          { _id: 'mock-3', name: 'Michael Brown', company: 'Global Services' },
          { _id: 'mock-4', name: 'Emily Davis', company: 'Innovative Systems' }
        ]);
      }
    };

    fetchLeads();
  }, []);

  const handleRemoveInteraction = (index) => {
    // Remove the interaction from the state
    setInteractions(prev => {
      const newInteractions = [...prev];
      newInteractions.splice(index, 1);
      return newInteractions;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername(null);
    navigate('/login');
  };

  return (
    <div className="lead-management">
      <header className="dashboard-header">
        <h1>Enhanced Sales Pipeline System</h1>
        <div className="header-controls">
          {username ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <nav className="auth-nav">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/pipeline" className="nav-link">Pipeline</Link>
              <Link to="/interactions" className="nav-link">Interactions</Link>
              <Link to="/signup" className="nav-link">Log Out</Link>
            </nav>
          )}
        </div>
      </header>

      <div className="content-wrapper">
        <div className="interaction-history">
          <div className="section-header">
            <h2 className="section-title">Interaction History</h2>
            <button
              className="add-interaction-btn"
              onClick={() => setShowInteractionForm(true)}
            >
              Add Interaction
            </button>
          </div>
          <p className="section-subtitle">Here are the recent interactions {leadName ? `with ${leadName}` : ''}:</p>
        {showInteractionForm &&
          <AddInteractionForm
            onClose={() => setShowInteractionForm(false)}
            setInteractions={setInteractions}
            leads={leads}
          />
        }
        {showEditForm &&
          <EditInteractionForm
            onClose={() => setShowEditForm(false)}
            setInteractions={setInteractions}
            interactionToEdit={currentInteraction}
            interactionIndex={currentInteractionIndex}
          />
        }
          <div className="interaction-list">
            <ul>
              {interactions.map((interaction, index) => (
                <li key={index} className="interaction-item">
                  <div className="interaction-content">
                    <div className="interaction-details">
                      <div className="interaction-date">{interaction.date}</div>
                      <div className="interaction-type">{interaction.type}</div>
                      <div className="interaction-notes">{interaction.notes}</div>
                    </div>
                    <div className="interaction-buttons">
                      <button
                        className="edit-interaction-btn"
                        onClick={() => {
                          setCurrentInteraction(interaction);
                          setCurrentInteractionIndex(index);
                          setShowEditForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="remove-interaction-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this interaction?')) {
                            handleRemoveInteraction(index);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionHistory;