import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FileViewer from './FileViewer';
import 'react-toastify/dist/ReactToastify.css';


const isValidCID = (cid) => {
  return typeof cid === 'string' && cid.length >= 46 && /^[a-zA-Z0-9]+$/.test(cid);
};


const EnterCID = ({ onSubmit }) => {
  const [inputCID, setInputCID] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!isValidCID(inputCID)) {
      toast.error("Enter valid CID", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    console.log('Valid CID:', inputCID); // Check if CID is valid
    onSubmit(inputCID);
    setInputCID('');
  };


    
  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 items-center mb-11"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.input
          type="text"
          placeholder="Paste CID here bruh..."
          value={inputCID}
          onChange={(e) => setInputCID(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
          animate={{ width: inputCID.length > 0 ? 400 : 300 }}
          style={{ minWidth: '180px' }}
        />
        <motion.button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
          animate={{ x: inputCID.length > 0 ? 10 : 0 }}
        >
          View File
        </motion.button>
      </motion.form>

      {showViewer && (
        <FileViewer fileUrl={cidToView} walletId="yourWallet" timestamp={new Date().toLocaleString()} />
      )}
    </>
  );
};

export default EnterCID;
