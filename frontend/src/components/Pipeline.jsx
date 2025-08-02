import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pipeline.css';
import AddDealForm from '../modals/AddDeal/AddDeal';
import EditDealForm from '../modals/EditDeal/EditDeal';
import DealDetails from '../modals/DealDetails/DealDetails';
import { deleteDeal, updateDeal } from '../services/dealService';

const Pipeline = () => {
  const [leads, setLeads] = useState({
    Cold: [],
    Warm: [],
    Hot: [],
    Cooked: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const [showDealForm, setShowDealForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDealDetails, setShowDealDetails] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState({
    Cold: [],
    Warm: [],
    Hot: [],
    Cooked: []
  });
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  // Fetch leads from API
  useEffect(() => {
// Inside the fetchLeads function
const fetchLeads = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');

    // Make the API request without requiring authentication
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leads`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });

    if (response.status === 404) {
      // If the API endpoint is not found, use mock data
      console.log('API endpoint not found, using mock data');
      const mockData = {
        Cold: [
          { _id: 'mock-1', name: 'Mock Lead 1', company: 'Mock Company', email: 'mock1@example.com', value: 1000, probability: 25, status: 'cold' },
          { _id: 'mock-2', name: 'Mock Lead 2', company: 'Mock Company', email: 'mock2@example.com', value: 2000, probability: 25, status: 'cold' }
        ],
        Warm: [
          { _id: 'mock-3', name: 'Mock Lead 3', company: 'Mock Company', email: 'mock3@example.com', value: 3000, probability: 50, status: 'warm' }
        ],
        Hot: [
          { _id: 'mock-4', name: 'Mock Lead 4', company: 'Mock Company', email: 'mock4@example.com', value: 4000, probability: 75, status: 'hot' }
        ],
        Cooked: [
          { _id: 'mock-5', name: 'Mock Lead 5', company: 'Mock Company', email: 'mock5@example.com', value: 5000, probability: 100, status: 'cooked' }
        ]
      };
      setLeads(mockData);
      setFilteredLeads(mockData);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle different response formats (array or object with leads property)
    const leadsArray = Array.isArray(data) ? data : (data.leads || []);

    // Group leads by status with validation
    const groupedLeads = {
      Cold: leadsArray.filter(lead => lead && lead.status === 'cold'),
      Warm: leadsArray.filter(lead => lead && lead.status === 'warm'),
      Hot: leadsArray.filter(lead => lead && lead.status === 'hot'),
      Cooked: leadsArray.filter(lead => lead && lead.status === 'cooked')
    };

    setLeads(groupedLeads);
    setFilteredLeads(groupedLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    setError('Failed to load leads. Please try again later.');
  } finally {
    setLoading(false);
  }
};

    fetchLeads();
  }, [navigate]);

  // Filter leads when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // If search term is empty, show all leads
      setFilteredLeads(leads);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    // Filter leads by name or category
    const filtered = {
      Cold: leads.Cold.filter(lead =>
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        'cold'.includes(term)
      ),
      Warm: leads.Warm.filter(lead =>
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        'warm'.includes(term)
      ),
      Hot: leads.Hot.filter(lead =>
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        'hot'.includes(term)
      ),
      Cooked: leads.Cooked.filter(lead =>
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        'cooked'.includes(term)
      )
    };

    setFilteredLeads(filtered);
  }, [searchTerm, leads]);

  const handleLogout = () => {
    // Use the logout function from AuthContext to properly clear all auth data
    authLogout();
    setUsername(null);
    navigate('/');
  };

  const handleRemoveDeal = async (dealId, category) => {
    try {
      // Find the lead object in the leads state
      const lead = leads[category].find((deal, index) => {
        const itemId = deal._id || `temp-id-${category}-${index}`;
        return itemId === dealId;
      });

      console.log('Removing deal:', dealId, 'from category:', category);
      console.log('Lead object:', lead);

      // Check if this is a temporary ID (starts with 'temp-id-' or 'mock-')
      const isTemporaryId = typeof dealId === 'string' &&
        (dealId.startsWith('temp-id-') || dealId.startsWith('mock-'));

      // Only make API call if it's a real ID
      if (!isTemporaryId && lead) {
        // Use the dealService to delete the deal, passing both the ID and the lead object
        await deleteDeal(dealId, lead);
      }

      // Remove the deal from the state
      setLeads(prev => {
        const newLeads = { ...prev };
        newLeads[category] = newLeads[category].filter((deal, index) => {
          // Handle both real and temporary IDs with category
          const itemId = deal._id || `temp-id-${category}-${index}`;
          return itemId !== dealId;
        });
        return newLeads;
      });
    } catch (error) {
      console.error('Error removing deal:', error);
      setError('Failed to remove deal. Please try again.');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Get the moved lead
    const lead = leads[source.droppableId].find((item, index) => {
      return item._id === draggableId || `temp-id-${source.droppableId}-${index}` === draggableId;
    });

    if (!lead) return;

    // Create a copy of the current state
    const newLeads = { ...leads };

    // Remove from source
    newLeads[source.droppableId] = newLeads[source.droppableId].filter((item, index) => {
      return item._id !== draggableId && `temp-id-${source.droppableId}-${index}` !== draggableId;
    });

    // Get the new status (lowercase)
    const newStatus = destination.droppableId.toLowerCase();

    // Update the lead with new status and probability
    const updatedLead = {
      ...lead,
      status: newStatus,
      probability: newStatus === 'cold' ? 25 : newStatus === 'warm' ? 50 : newStatus === 'hot' ? 75 : newStatus === 'cooked' ? 100 : 0
    };

    // Add to destination
    newLeads[destination.droppableId] = [
      ...newLeads[destination.droppableId],
      updatedLead
    ];

    // Update state
    setLeads(newLeads);

    // Only update in database if we have a valid ID
    if (lead._id) {
      try {
        setLoading(true);
        // Use the dealService to update the deal status
        await updateDeal(lead._id, {
          status: newStatus,
          probability: updatedLead.probability
        });
        setLoading(false);
      } catch (error) {
        console.error('Error updating lead status:', error);
        setError('Failed to update lead status. The change may not be saved.');
        setLoading(false);
        // Optionally revert the UI state if the API call fails
        // fetchLeads();
      }
    }
  };

  const refreshLeads = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leads`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (response.status === 404) {
        // If the API endpoint is not found, use mock data
        console.log('API endpoint not found, using mock data');
        const mockData = {
          Cold: [
            { _id: 'mock-1', name: 'Mock Lead 1', company: 'Mock Company', email: 'mock1@example.com', value: 1000, probability: 25, status: 'cold' },
            { _id: 'mock-2', name: 'Mock Lead 2', company: 'Mock Company', email: 'mock2@example.com', value: 2000, probability: 25, status: 'cold' }
          ],
          Warm: [
            { _id: 'mock-3', name: 'Mock Lead 3', company: 'Mock Company', email: 'mock3@example.com', value: 3000, probability: 50, status: 'warm' }
          ],
          Hot: [
            { _id: 'mock-4', name: 'Mock Lead 4', company: 'Mock Company', email: 'mock4@example.com', value: 4000, probability: 75, status: 'hot' }
          ],
          Cooked: [
            { _id: 'mock-5', name: 'Mock Lead 5', company: 'Mock Company', email: 'mock5@example.com', value: 5000, probability: 100, status: 'cooked' }
          ]
        };
        setLeads(mockData);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats (array or object with leads property)
      const leadsArray = Array.isArray(data) ? data : (data.leads || []);

      // Group leads by status with validation
      const groupedLeads = {
        Cold: leadsArray.filter(lead => lead && lead.status === 'cold'),
        Warm: leadsArray.filter(lead => lead && lead.status === 'warm'),
        Hot: leadsArray.filter(lead => lead && lead.status === 'hot'),
        Cooked: leadsArray.filter(lead => lead && lead.status === 'cooked')
      };

      setLeads(groupedLeads);
      setFilteredLeads(groupedLeads);
    } catch (error) {
      console.error('Error refreshing leads:', error);
      setError('Failed to refresh leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-management">
      <header className="dashboard-header">
        <h1>Sales Pipeline System</h1>
            <nav className="auth-nav">
                   <Link to="/dashboard"><button className="nav-link">Dashboard</button></Link>
                   <Link to="/pipeline"><button className="nav-link active">Pipeline</button></Link>
                   <Link to="/interactions"><button className="nav-link">Interactions</button></Link>
                   <button className="nav-link" onClick={handleLogout}>Log Out</button>
                 </nav>
      </header>

      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            Lead Pipeline
            {searchTerm && (
              <span className="search-indicator"> (Filtered)</span>
            )}
          </h2>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                className={`search-input ${searchTerm ? 'active-search' : ''}`}
                placeholder="Search leads by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <button
              className="add-deal-btn"
              onClick={() => setShowDealForm(true)}
            >
              Add Deal
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading leads...</p>
          </div>
        ) : (
          <>
            {showDealForm && <AddDealForm onClose={() => setShowDealForm(false)} setLeads={setLeads} />}
            {showEditForm && <EditDealForm
              onClose={() => setShowEditForm(false)}
              setLeads={setLeads}
              dealToEdit={currentDeal}
              category={currentCategory}
            />}
            {showDealDetails && <DealDetails
              deal={currentDeal}
              onClose={() => setShowDealDetails(false)}
            />}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="pipeline-container">
                {Object.keys(filteredLeads).map((category) => (
                  <Droppable key={category} droppableId={category}>
                    {(provided) => (
                      <div
                        className="pipeline-column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <h3 className="column-title">{category}</h3>
                        <div className="leads-container">
                          {filteredLeads[category].length === 0 ? (
                            <div className="empty-column">
                              {searchTerm ? 'No matching leads in this stage' : 'No leads in this stage'}
                            </div>
                          ) : (
                            filteredLeads[category].map((lead, index) => {
                              // Create a stable ID for each lead
                              const leadId = lead._id || `temp-id-${category}-${index}`;

                              // Store the index in the lead object for reference
                              lead.index = index;

                              return (
                                <Draggable key={leadId} draggableId={leadId} index={index}>
                                  {(provided) => (
                                    <div
                                      className="lead-card"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => {
                                        setCurrentDeal(lead);
                                        setShowDealDetails(true);
                                      }}
                                    >
                                      <div className="lead-content">
                                        <div className="lead-header">
                                          <span className="lead-name">{lead.name || 'Unnamed Lead'}</span>
                                          <span className="lead-probability">{lead.probability || 0}%</span>
                                        </div>
                                        <div className="lead-details">
                                          {lead.company && <p className="lead-company">{lead.company}</p>}
                                          {lead.value > 0 && <p className="lead-value">₱{lead.value.toLocaleString()}</p>}
                                          {lead.email && <p className="lead-email">{lead.email}</p>}
                                        </div>
                                        <div className="deal-buttons">
                                          <button
                                            className="edit-deal-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setCurrentDeal(lead);
                                              setCurrentCategory(category);
                                              setShowEditForm(true);
                                            }}
                                          >
                                            Edit
                                          </button>
                                          <button
                                            className="remove-deal-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (window.confirm('Are you sure you want to remove this deal?')) {
                                                handleRemoveDeal(leadId, category);
                                              }
                                            }}
                                          >
                                            Remove
                                          </button>
                                          <button
                                            className="view-details-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setCurrentDeal(lead);
                                              setShowDealDetails(true);
                                            }}
                                          >
                                            Details
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </>
        )}
      </div>
    </div>
  );
};

export default Pipeline;
