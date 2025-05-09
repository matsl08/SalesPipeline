// src/components/InteractionHistory.jsx
import React from 'react';

const InteractionHistory = ({ leadName }) => {
  const interactions = [
    { date: '2025-05-01', type: 'Call', notes: 'Discussed the new product.' },
    { date: '2025-05-02', type: 'Email', notes: 'Followed up on the proposal.' },
    { date: '2025-05-03', type: 'Meeting', notes: 'Meeting to finalize the contract.' },
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Interaction History for {leadName}</h3>
      <ul className="space-y-3">
        {interactions.map((interaction, index) => (
          <li key={index} className="border-b py-2">
            <strong>{interaction.date}</strong> - {interaction.type}
            <p className="text-sm">{interaction.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InteractionHistory;
