import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Interactions.css';
import AddInteractionForm from '../modals/AddInteraction/AddInteraction';
import EditInteractionForm from '../modals/EditInteraction/EditInteraction';
import { fetchInteractions, fetchInteractionsByLead, deleteInteraction } from '../services/interactionService';


const InteractionHistory = ({ leadName }) => {
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(-1);
  const [interactions, setInteractions] = useState([]);
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  // Fetch interactions data
  useEffect(() => {
    const getInteractions = async () => {
      try {
        let interactionsData;

        if (leadName) {
          // If a leadName is provided, find the lead ID and fetch interactions for that lead
          const lead = leads.find(l => l.name === leadName);
          if (lead && lead._id) {
            interactionsData = await fetchInteractionsByLead(lead._id);
          } else {
            interactionsData = await fetchInteractions();
          }
        } else {
          // Otherwise fetch all interactions
          interactionsData = await fetchInteractions();
        }

        // Format the interactions for display
        const formattedInteractions = interactionsData.map(interaction => ({
          _id: interaction._id,
          date: interaction.date || new Date(interaction.createdAt).toISOString().split('T')[0],
          type: interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1),
          notes: interaction.notes || interaction.summary
        }));

        setInteractions(formattedInteractions);
      } catch (error) {
        console.error('Error fetching interactions:', error);
        setInteractions([]);
      }
    };

    getInteractions();
  }, [leadName, leads]);

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
        }
      } catch (error) {
        console.error('Error fetching leads for interactions:', error);
      }
    };

    fetchLeads();
  }, []);

  const handleRemoveInteraction = async (interaction, index) => {
    try {
      if (window.confirm('Are you sure you want to remove this interaction?')) {
        // If we have an ID, use the service to delete from the database
        if (interaction._id) {
          await deleteInteraction(interaction._id);
        }

        // Remove the interaction from the state
        setInteractions(prev => {
          const newInteractions = [...prev];
          newInteractions.splice(index, 1);
          return newInteractions;
        });

        // Show success message
        console.log('Interaction removed successfully');
      }
    } catch (error) {
      console.error('Error removing interaction:', error);
      alert('Failed to remove interaction. Please try again.');
    }
  };

  const handleLogout = () => {
    // Use the logout function from AuthContext to properly clear all auth data
    authLogout();
    setUsername(null);
    navigate('/login');
  };

  return (
    <div className="lead-management">
      <header className="dashboard-header">
        <h1>Enhanced Sales Pipeline System</h1>
        <div className="header-controls">
          <nav className="auth-nav">
            <Link to="/dashboard"><button className="nav-link">Dashboard</button></Link>
            <Link to="/pipeline"><button className="nav-link">Pipeline</button></Link>
            <Link to="/interactions"><button className="nav-link active">Interactions</button></Link>
            <button className="nav-link" onClick={handleLogout}>Log Out</button>
          </nav>
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
          {interactions.length === 0 ? (
            <div className="empty-column">No interactions to show</div>
          ): (
          <p className="section-subtitle">Here are the recent interactions {leadName ? `with ${leadName}` : ''}:</p>
          )}
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
                        onClick={() => handleRemoveInteraction(interaction, index)}
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
