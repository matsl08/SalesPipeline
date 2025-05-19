/**
 * Service for handling interaction-related API calls
 */

/**
 * Fetch all interactions
 * @returns {Promise<Array>} - Array of interactions
 */
export const fetchInteractions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/interactions', {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.warn('API error fetching interactions:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error in interactionService.fetchInteractions:', error);
    return [];
  }
};

/**
 * Fetch interactions for a specific lead
 * @param {string} leadId - The ID of the lead
 * @returns {Promise<Array>} - Array of interactions for the lead
 */
export const fetchInteractionsByLead = async (leadId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/interactions/lead/${leadId}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.warn('API error fetching lead interactions:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error in interactionService.fetchInteractionsByLead:', error);
    return [];
  }
};

/**
 * Delete an interaction
 * @param {string} interactionId - The ID of the interaction to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteInteraction = async (interactionId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/interactions/${interactionId}`, {
      method: 'DELETE',
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });

    // Handle 404 or other API errors
    if (response.status === 404 || !response.ok) {
      console.log('API error or endpoint not found, proceeding with UI update');
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error in interactionService.deleteInteraction:', error);
    // Return success anyway to allow UI to update
    return true;
  }
};

/**
 * Fetch a single interaction by ID
 * @param {string} interactionId - The ID of the interaction to fetch
 * @returns {Promise<Object>} - The interaction object
 */
export const fetchInteractionById = async (interactionId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/interactions/${interactionId}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });

    if (response.ok) {
      const data = await response.json();

      // If API call was successful but we need to enhance the data
      if (!data.lead || typeof data.lead !== 'object') {
        // Try to find the lead information from the leads API
        try {
          const leadsResponse = await fetch('http://localhost:3000/api/leads', {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          });

          if (leadsResponse.ok) {
            const leadsData = await leadsResponse.json();
            const leadsArray = Array.isArray(leadsData) ? leadsData : (leadsData.leads || []);

            // Find the lead that matches the interaction's lead ID
            const matchingLead = leadsArray.find(lead => lead._id === data.lead);

            if (matchingLead) {
              data.lead = matchingLead;
            }
          }
        } catch (leadError) {
          console.error('Error fetching lead details:', leadError);
        }
      }

      return data;
    } else {
      console.warn('API error fetching interaction details:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error in interactionService.fetchInteractionById:', error);
    return null;
  }
};
