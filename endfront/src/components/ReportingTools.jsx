// ReportingTools.jsx content here
// src/components/ReportingTools.jsx
import React from 'react';

const ReportingTools = () => {
  const handleExport = () => {
    // Logic to export data (e.g., downloading as CSV)
    alert("Exporting report...");
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Reporting Tools</h3>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleExport}
      >
        Export Report
      </button>
    </div>
  );
};

export default ReportingTools;
