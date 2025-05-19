import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null); 

        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/analytics/dashboard?t=${timestamp}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Analytics data received:', data);

        // Transform the status distribution data for the chart
        if (data.statusDistribution && data.statusDistribution.length > 0) {
          const formattedData = data.statusDistribution.map(item => {
            // For 'cooked' status, use 'prospects' as the key for different color
            if (item.status === 'cooked') {
              return { name: item.status.charAt(0).toUpperCase() + item.status.slice(1), leads: item.count };
            }
            // For other statuses, use 'leads' as the key
            return { name: item.status.charAt(0).toUpperCase() + item.status.slice(1), leads: item.count };
          });
          setChartData(formattedData);
        } else {
          // Fallback to default data if no distribution data is available
          setChartData([
            { name: 'Cold', leads: 0 },
            { name: 'Warm', leads: 0 },
            { name: 'Hot', leads: 0 },
            { name: 'Cooked', leads: 0 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error.message || 'Failed to load analytics data');
        // Set default data on error
        setChartData([
          { name: 'Cold', leads: 0 },
          { name: 'Warm', leads: 0 },
          { name: 'Hot', leads: 0 },
          { name: 'Cooked', leads: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading sales analytics...</div>;
  }

  if (error) {
    return <div className="error">Error loading analytics: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
     
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leads" fill="#8884d8" name="Leads" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsDashboard;
