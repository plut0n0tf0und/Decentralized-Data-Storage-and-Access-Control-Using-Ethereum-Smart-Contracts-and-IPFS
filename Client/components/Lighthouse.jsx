import React from 'react';

const Lighthouse = ({ uploadedCid, targetWallet, currentUserWallet }) => {
  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-4 w-full max-w-md">
      <p><strong>Target Wallet:</strong> {targetWallet || 'N/A'}</p>
      <p><strong>Current User Wallet:</strong> {currentUserWallet || 'N/A'}</p>
    </div>
  );
};

export default Lighthouse;
