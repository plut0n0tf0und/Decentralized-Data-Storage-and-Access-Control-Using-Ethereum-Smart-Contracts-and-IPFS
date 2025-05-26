import React from 'react';
import { motion } from 'framer-motion';

const AccessDisabled = () => {
  return (
    <motion.div
      className="text-center mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-extrabold text-red-700 mb-4">
        🚫 No Entry, Homie
      </h2>
      <p className="text-gray-700 text-lg">
        This CID ain't alive or you ain't on the guest list. <br />
        (Try a valid one or ask the uploader to hook you up.)
      </p>
    </motion.div>
  );
};

export default AccessDisabled;
