import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const isValidCID = (cid) => {
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

    console.log('Valid CID:', inputCID);
    onSubmit(inputCID);
    setInputCID('');
  };

  return (

<form
  onSubmit={handleSubmit}
  className="flex flex-col sm:flex-row gap-4 items-center mb-9 w-full max-w-[70rem]"
>
  <input
    type="text"
    placeholder="Paste CID here..."
    value={inputCID}
    onChange={(e) => setInputCID(e.target.value)}
    className="w-full max-w-[55rem] border-2 border-blue-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <button
    type="submit"
    className="px-9 py-2 h-[46px] bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
  >
    View File
  </button>
</form>

  );
};

export default EnterCID;
