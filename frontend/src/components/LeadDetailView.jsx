// LeadDetailView.jsx

import React, { createContext, useState, useContext } from 'react';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [currentLead, setCurrentLead] = useState(null);

  return (
    <LeadContext.Provider value={{ leads, setLeads, currentLead, setCurrentLead }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);
