import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = () => {
  const data = [
  { name: 'Cold', leads: 10 },
  { name: 'Warm', leads: 20 },
  { name: 'Hot', leads: 15 },
  { name: 'Cooked', prospects: 5 },
];
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Sales Analytics</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leads" fill="#8884d8" />
           <Bar dataKey="prospects" fill="#8d1021" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsDashboard;
