import React from 'react';
import './ViewAnalytics.css';
import { Bar } from 'react-chartjs-2';

const ViewAnalytics = () => {
    const chartData = {
        labels: ['Rep A', 'Rep B', 'Rep C'],
        datasets: [
        {
            label: 'Sales Achieved',
            data: [12500, 15000, 10000],
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Performance by Sales Representative',
            },
        },
    };


    
  return (
    <div className="view-analytics-container">
      <h1>Sales Performance Analytics</h1>
      <div className="analytics-details">
        <p>Here you can view detailed analytics about sales performance, trends, and more.</p>
      </div>
    </div>
  );
};

export default ViewAnalytics;
