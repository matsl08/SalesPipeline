// // components/StatusDashboard.jsx
// import { useMemo } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const StatusDashboard = ({ leads }) => {
//   const statusData = useMemo(() => {
//     const statusCounts = leads.reduce((acc, lead) => {
//       acc[lead.status] = (acc[lead.status] || 0) + 1;
//       return acc;
//     }, {});
    
//     return Object.entries(statusCounts).map(([status, count]) => ({
//       name: status.toUpperCase(),
//       value: count,
//       percentage: Math.round((count / leads.length) * 100)
//     }));
//   }, [leads]);

//   const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884D8'];

//   return (
//     <div className="dashboard-card">
//       <h3>Lead Status Distribution</h3>
//       <PieChart width={400} height={300}>
//         <Pie
//           data={statusData}
//           cx="50%"
//           cy="50%"
//           labelLine={false}
//           outerRadius={80}
//           fill="#8884d8"
//           dataKey="value"
//           label={({ name, percentage }) => `${name} ${percentage}%`}
//         >
//           {statusData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//       <div className="status-summary">
//         {statusData.map(item => (
//           <div key={item.name} className="status-item">
//             <span className="status-color" style={{ backgroundColor: COLORS[statusData.indexOf(item)] }} />
//             {item.name}: {item.value} ({item.percentage}%)
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default StatusDashboard;