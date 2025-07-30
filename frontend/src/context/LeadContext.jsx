// LeadContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create a context
const LeadContext = createContext();

// Context Provider component
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [currentLead, setCurrentLead] = useState(null);

  return (
    <LeadContext.Provider value={{ leads, setLeads, currentLead, setCurrentLead }}>
      {children}
    </LeadContext.Provider>
  );
};

// Custom hook to use the LeadContext
export const useLeads = () => useContext(LeadContext);
