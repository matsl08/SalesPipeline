//  import React, { useState } from 'react';
//  import { Link, useNavigate } from 'react-router-dom';
//  import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//  import './LeadManagement.css';

//  const initialLeads = {
//    Cold: [{ id: '1', name: 'John Doe' }, { id: '2', name: 'mr. nobody' }],
//    Warm: [{ id: '3', name: 'Sam Wilson' }],
//    Hot: [{ id: '4', name: 'Mathew Laresma' }],
//    Cooked: [{ id: '5', name: 'Ronelo Mirafuentes' }]
//  };

//  const LeadManagement = () => {
//    const [leads, setLeads] = useState(initialLeads);
//    const [username, setUsername] = useState(localStorage.getItem('user'));
//    const navigate = useNavigate();

//    const handleLogout = () => {
//      localStorage.removeItem('token');
//      localStorage.removeItem('user');
//      setUsername(null);
//      navigate('/login');
//    };

//    const onDragEnd = (result) => {
//      const { source, destination } = result;
//      if (!destination) return;

//      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//      const start = [...leads[source.droppableId]];
//      const [removed] = start.splice(source.index, 1);
//      const end = [...leads[destination.droppableId]];
//      end.splice(destination.index, 0, removed);

//      setLeads((prevLeads) => ({
//        ...prevLeads,
//        [source.droppableId]: start,
//        [destination.droppableId]: end
//      }));
//    };

//    return (
//      <div className="lead-management">
//        <header className="dashboard-header">
//          <h1>Enhanced Sales Pipeline System</h1>
//          <div className="header-controls">
//            {username ? (
//              <button onClick={handleLogout} className="logout-btn">
//                Logout
//              </button>
//            ) : (
//              <nav className="auth-nav">
//                <Link to = "/dashboard" className="nav-link">Dashboard</Link>
//                <Link to="/pipeline" className="nav-link">Pipeline</Link>
//                <Link to="/signup" className="nav-link">Log Out</Link>
//              </nav>
//            )}
//          </div>
//        </header>
      
//        <div className="content-wrapper">
//          <h2 className="section-title">Lead Pipeline</h2>
//          <DragDropContext onDragEnd={onDragEnd}>
//            <div className="pipeline-container">
//              {Object.keys(leads).map((category) => (
//                <Droppable key={category} droppableId={category}>
//                  {(provided) => (
//                    <div
//                      className="pipeline-column"
//                      ref={provided.innerRef}
//                      {...provided.droppableProps}
//                    >
//                      <h3 className="column-title">{category}</h3>
//                      <div className="leads-container">
//                        {leads[category].map((lead, index) => (
//                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
//                            {(provided) => (
//                              <div
//                                className="lead-card"
//                                ref={provided.innerRef}
//                                {...provided.draggableProps}
//                                {...provided.dragHandleProps}
//                              >
//                                {lead.name}
//                              </div>
//                            )}
//                          </Draggable>
//                        ))}
//                        {provided.placeholder}
//                      </div>
//                    </div>
//                  )}
//                </Droppable>
//              ))}
//            </div>
//          </DragDropContext>
//        </div>
//      </div>
//    );
//  };

//  export default LeadManagement;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import './LeadManagement.css';

const initialLeads = {
  Cold: [{ id: '1', name: 'John Doe' }, { id: '2', name: 'mr. nobody' }],
  Warm: [{ id: '3', name: 'Dorothy Ranario' }],
  Hot: [{ id: '4', name: 'Mathew Laresma' }],
  Cooked: [{ id: '5', name: 'Ronelo Mirafuentes' }]
};

const LeadManagement = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const [showDealForm, setShowDealForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    email: '',
    company: '',
    value: '',
    status: 'cold',
    category: 'prospect',
    phone: '',
    notes: ''
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername(null);
    navigate('/login');
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = [...leads[source.droppableId]];
    const [removed] = start.splice(source.index, 1);
    const end = [...leads[destination.droppableId]];
    end.splice(destination.index, 0, removed);

    setLeads((prevLeads) => ({
      ...prevLeads,
      [source.droppableId]: start,
      [destination.droppableId]: end
    }));
  };

  const handleAddDeal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/leads', newDeal, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        setLeads(prev => ({
          ...prev,
          [newDeal.status]: [...prev[newDeal.status], response.data]
        }));
        setShowDealForm(false);
        setNewDeal({
          name: '',
          email: '',
          company: '',
          value: '',
          status: 'cold',
          category: 'prospect',
          phone: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const renderDealForm = () => (
    <div className="overlay">
      <div className="deal-form-container">
        <h3>Add New Deal</h3>
        <form onSubmit={handleAddDeal}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={newDeal.name}
              onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={newDeal.email}
              onChange={(e) => setNewDeal({...newDeal, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={newDeal.company}
              onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Deal Value</label>
            <input
              type="number"
              value={newDeal.value}
              onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={newDeal.status}
              onChange={(e) => setNewDeal({...newDeal, status: e.target.value})}
            >
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="cooked">Cooked</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={newDeal.phone}
              onChange={(e) => setNewDeal({...newDeal, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={newDeal.notes}
              onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Deal</button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowDealForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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
              <Link to="/signup" className="nav-link">Log Out</Link>
            </nav>
          )}
        </div>
      </header>
      
      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">Lead Pipeline</h2>
          <button 
            className="add-deal-btn"
            onClick={() => setShowDealForm(true)}
          >
            Add Deal
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="pipeline-container">
            {Object.keys(leads).map((category) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    className="pipeline-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="column-title">{category}</h3>
                    <div className="leads-container">
                      {leads[category].map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided) => (
                            <div
                              className="lead-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {lead.name}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      
      {showDealForm && renderDealForm()}
    </div>
  );
};

export default LeadManagement;