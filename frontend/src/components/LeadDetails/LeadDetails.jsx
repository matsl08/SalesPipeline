// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { isValidObjectId } from '../utils/validation';

// const LeadDetails = ({ onLeadUpdated, onLeadDeleted, showSnackbar }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [lead, setLead] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isValidObjectId(id)) {
//       showSnackbar('Invalid lead ID format', 'error');
//       navigate('/');
//       return;
//     }

//     const fetchLead = async () => {
//       try {
//         const response = await fetch(`/api/leads/${id}`);
//         if (!response.ok) {
//           throw new Error('Lead not found');
//         }
//         const data = await response.json();
//         setLead(data);
//       } catch (error) {
//         showSnackbar(error.message, 'error');
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLead();
//   }, [id, navigate, showSnackbar]);

//   // ... rest of the component
// };

// export default LeadDetails;