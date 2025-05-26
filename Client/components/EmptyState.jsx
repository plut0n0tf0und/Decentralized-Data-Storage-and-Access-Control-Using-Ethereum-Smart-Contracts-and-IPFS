// EmptyState.jsx
import React from 'react';
import { motion } from 'framer-motion';


const EmptyState = () => {
  return (
    <div className="text-center text-gray-600 mt-1">
      <div className="text-4xl mb-4">📂</div>
      <p className="text-sm">Paste a CID above to load your file.</p>
    </div>
  );
};

export default EmptyState;
