import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Invoice from './Invoice';

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    // Redirect to home page if no booking information
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Invoice booking={booking} />
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;