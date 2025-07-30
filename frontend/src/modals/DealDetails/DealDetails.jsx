import React from 'react';
import './DealDetails.css';

const DealDetails = ({ deal, onClose }) => {
  if (!deal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content deal-details-modal">
        <div className="modal-header">
          <h2>Deal Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="deal-details-content">
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{deal.name || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Company:</span>
            <span className="detail-value">{deal.company || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{deal.email || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{deal.phone || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Value:</span>
            <span className="detail-value">${deal.value ? deal.value.toLocaleString() : '0'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Probability:</span>
            <span className="detail-value">{deal.probability || '0'}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="detail-value">{deal.status ? deal.status.charAt(0).toUpperCase() + deal.status.slice(1) : 'N/A'}</span>
          </div>
          {deal.notes && (
            <div className="detail-row notes-row">
              <span className="detail-label">Notes:</span>
              <span className="detail-value">{deal.notes}</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
