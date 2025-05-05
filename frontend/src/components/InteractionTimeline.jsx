// // components/InteractionTimeline.jsx
// import { format } from 'date-fns';

// const InteractionTimeline = ({ interactions }) => {
//   return (
//     <div className="timeline-container">
//       <h3>Interaction History</h3>
//       <div className="timeline">
//         {interactions.map((interaction) => (
//           <div key={interaction._id} className="timeline-item">
//             <div className="timeline-date">
//               {format(new Date(interaction.date), 'MMM dd, yyyy')}
//             </div>
//             <div className="timeline-content">
//               <div className="timeline-type">{interaction.type.toUpperCase()}</div>
//               <div className="timeline-outcome" data-outcome={interaction.outcome}>
//                 {interaction.outcome}
//               </div>
//               <p>{interaction.summary}</p>
//               {interaction.nextSteps && (
//                 <div className="next-steps">
//                   <strong>Next Steps:</strong> {interaction.nextSteps}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InteractionTimeline;