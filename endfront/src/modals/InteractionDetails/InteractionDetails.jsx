import React, { useState, useEffect } from 'react';
import './InteractionDetails.css';
import { fetchInteractionById } from '../../services/interactionService';

const InteractionDetails = ({ interactionId, interaction: initialInteraction, onClose }) => {
  const [interaction, setInteraction] = useState(initialInteraction || null);
  const [loading, setLoading] = useState(!initialInteraction);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have the interaction data, no need to fetch
    if (initialInteraction) {
      setInteraction(initialInteraction);
      setLoading(false);
      return;
    }

    const getInteractionDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchInteractionById(interactionId);

        if (data) {
          setInteraction(data);
        } else {
          setError('Could not load interaction details');
        }
      } catch (err) {
        console.error('Error fetching interaction details:', err);
        setError('An error occurred while loading interaction details');
      } finally {
        setLoading(false);
      }
    };

    if (interactionId) {
      getInteractionDetails();
    }
  }, [interactionId, initialInteraction]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content interaction-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Interaction Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="interaction-details-content">
          {loading ? (
            <div className="loading-indicator">Loading interaction details...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : interaction ? (
            <>
             <div className="detail-row">
                <span className="detail-label">Lead:</span>
                <span className="detail-value">
                  {interaction.lead ? (
                    typeof interaction.lead === 'object' ? (
                      <>
                        {interaction.lead.name || 'N/A'}
                        {interaction.lead.company ? ` - ${interaction.lead.company}` : ''}
                      </>
                    ) : (
                      interaction.lead
                    )
                  ) : 'N/A'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(interaction.date || interaction.createdAt)}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{interaction.type ? interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) : 'N/A'}</span>
              </div>

 

              {interaction.participants && interaction.participants.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Participants:</span>
                  <span className="detail-value">
                    {Array.isArray(interaction.participants)
                      ? interaction.participants.join(', ')
                      : interaction.participants}
                  </span>
                </div>
              )}

              {interaction.summary && (
                <div className="detail-row">
                  <span className="detail-label">Summary:</span>
                  <span className="detail-value">{interaction.summary}</span>
                </div>
              )}

              {interaction.notes && (
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value">{interaction.notes}</span>
                </div>
              )}

              {interaction.outcome && (
                <div className="detail-row">
                  <span className="detail-label">Outcome:</span>
                  <span className="detail-value">{interaction.outcome.charAt(0).toUpperCase() + interaction.outcome.slice(1)}</span>
                </div>
              )}

              {interaction.nextSteps && (
                <div className="detail-row">
                  <span className="detail-label">Next Steps:</span>
                  <span className="detail-value">{interaction.nextSteps}</span>
                </div>
              )}

              {interaction.followUpDate && (
                <div className="detail-row">
                  <span className="detail-label">Follow-up Date:</span>
                  <span className="detail-value">{formatDate(interaction.followUpDate)}</span>
                </div>
              )}

              {interaction.createdBy && (
                <div className="detail-row">
                  <span className="detail-label">Created By:</span>
                  <span className="detail-value">{interaction.createdBy.name || interaction.createdBy.email || 'N/A'}</span>
                </div>
              )}
            </>
          ) : (
            <div className="empty-message">No interaction details available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractionDetails;
