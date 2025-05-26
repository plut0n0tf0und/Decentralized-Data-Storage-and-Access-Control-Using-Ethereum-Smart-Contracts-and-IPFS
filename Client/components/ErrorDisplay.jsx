import React from 'react';
import { motion } from 'framer-motion';

const ErrorDisplay = () => {
  return (
    <motion.div
      className="text-center mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-red-700 mb-3">💥 Error Occurred</h2>
      <p className="text-gray-600 text-lg">
        Sh*t’s broken, bruh. Something went sideways.  
        <br />Try again later or scream into the void 😤
      </p>
    </motion.div>
  );
};

export default ErrorDisplay;
