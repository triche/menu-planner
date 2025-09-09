import React from 'react';

interface ProductionNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductionNotice: React.FC<ProductionNoticeProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>🚀 Production Setup Information</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="info-section">
            <h4>Why Direct API Calls May Fail</h4>
            <p>
              Modern browsers implement CORS (Cross-Origin Resource Sharing) policies that may block 
              direct API calls to external services like OpenAI from web applications.
            </p>
          </div>

          <div className="info-section">
            <h4>Recommended Production Setup</h4>
            <ol>
              <li><strong>Backend Proxy:</strong> Create a backend API that handles OpenAI requests</li>
              <li><strong>Environment Variables:</strong> Store API keys securely on the server</li>
              <li><strong>Authentication:</strong> Implement user authentication and rate limiting</li>
              <li><strong>Error Handling:</strong> Proper server-side error handling and logging</li>
            </ol>
          </div>

          <div className="info-section">
            <h4>Demo Mode</h4>
            <p>
              When API calls fail due to CORS or network issues, the app automatically falls back 
              to demo mode with sample meal plans to showcase the functionality.
            </p>
          </div>

          <div className="info-section">
            <h4>Development Testing</h4>
            <p>
              To test with a real API key during development:
            </p>
            <ul>
              <li>Use a CORS browser extension (development only)</li>
              <li>Run Chrome with <code>--disable-web-security</code> flag (development only)</li>
              <li>Set up a local proxy server</li>
            </ul>
            <p><strong>⚠️ Never disable security features in production!</strong></p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-button" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionNotice;
