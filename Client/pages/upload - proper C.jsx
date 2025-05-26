import React, { useState, useEffect, useRef } from 'react';
import { uploadFileToLighthouse } from '../services/lighthouse';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './upload.css';
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";
import { FiCopy } from "react-icons/fi";  // Feather Icons - Minimal & Clean
import { FiCheck } from "react-icons/fi"; // Tick Icon

const contractAddress = "0x2dF8a2c89EA77d93016f833c1ac2F47fb1E047C6";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cid, setCid] = useState(null);
  const [isStored, setIsStored] = useState(false);
  const maxSizeMB = 10;
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size / (1024 * 1024) > maxSizeMB) {
      toast.error("File too large! Max 10MB allowed 🚫");
      return;
    }
    setFile(droppedFile); 
    toast.success(`File selected: ${droppedFile.name}`);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size / (1024 * 1024) > maxSizeMB) {
      toast.error("File too large! Max 10MB allowed 🚫");
      return;
    }
    setFile(selectedFile); 
  };

  const handleCancel = () => {
    setFile(null); 
    const showGlassToast = (msg) => {
      toast.error("File selection canceled", {
        position: "top-right",
        autoClose: 1500, // 3 sec
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored", // or "dark" / "light"
      });      
      
    };
    
    // Usage
    showGlassToast("⚠️ Please enter a valid CID.");
    
    
    // Force reset file input (prevents focus issue)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };
  

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected", {
        position: "top-right",
        autoClose: 500, //  sec
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored", // or "dark" / "light"
      });  
      return;
    }
    try {
      setUploading(true);
      setProgress(30);
      const cid = await uploadFileToLighthouse(file);
      setProgress(100);
      toast.success(
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🎉 File uploaded!
        </motion.div>
      );
      setCid(cid);
      setFile(null);
      document.getElementById('fileInput').value = null;
    } catch (error) {
      console.error(error);
      toast.error("Upload failed 💥");
    } finally {
      setUploading(false);
      setProgress(0); 
    }
  };

  const handleStoreCid = async () => {
    console.log("Store CID button clicked!");
    if (!window.ethereum) {
      toast.error("MetaMask not found! 🚫");
      return;
    }
  
    if (!cid || !cid.trim()) {
      toast.error("CID is empty or invalid 🫠");
      return;
    }
  
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);
      
      console.log("🟡 CID:", cid);
      const tx = await contract.storeCID(cid, { gasLimit: 500000 });
      console.log("🟡 Tx sent:", tx.hash);
  
      const toastId = toast.loading("Waiting for confirmation...");
      const receipt = await tx.wait();
      toast.dismiss(toastId); // 💥 Kill it once confirmed

      if (receipt && receipt.blockNumber) {
        console.log("✅ Confirmed in block:", receipt.blockNumber);
        toast.success("CID stored and confirmed on-chain!");
        setIsStored(true);
      } else {
        console.warn("⚠️ Tx not mined or dropped.");
        toast.error("Transaction may not be mined. Try again.");
      }
    } catch (error) {
      if (error?.code === 4001) {
        toast.error("Transaction cancelled by user 🛑");
      } else {
        console.error("❌ Error storing CID:", error);
        toast.error(`Error: ${error.reason || "Something went wrong"}`);
      }
    }
  };
  

  const handleCopy = () => {
    if (cid) {
      navigator.clipboard.writeText(cid);
        setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Revert after 1.5 sec
    }
  };
  
  useEffect(() => {
    const handleWindowDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleWindowDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.size / (1024 * 1024) > maxSizeMB) {
        toast.error("File too large! Max 10MB allowed 🚫");
        return;
      }
      setFile(droppedFile); 
      toast.success(`File selected: ${droppedFile.name}`);
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  return (
    <div className="page-container">
          {/* Upload Section */}
          <div className="file-actions-row flex-col justify-between w-full max-w-[68rem] px-4">{/*bg-white rounded-xl shadow-lg flex */}

          <h2 className=" text-2xl font-semibold	 text-gray-800 mb-4 text-left self-start ">
            Upload a file
          </h2>


      <div className="upload-box" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}>
        <input id="fileInput" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <p className="upload-text-title">Drag & Drop the file to upload it on IPFS</p>
        <p className="upload-text-sub">(or click the box)</p>
      </div>

          <div className="file-actions-row flex  justify-between w-full max-w-[68rem] mt-3 ">
      <div className="flex items-center gap-4">
        {file && <p className="text-medium font-medium text-gray-800 break-words px-4">{file.name}</p>}
        {file && (
          <button 
            onClick={handleCancel} 
            className="text-red-500 font-semibold hover:underline text-medium"
          >
            Clear File
          </button>
        )}
      </div>
      
      <button 
      onClick={handleUpload}
      className={`relative bg-blue-600 hover:bg-blue-500 text-white font-semibold mt-2 px-6 py-2 rounded-lg shadow-md transition-all duration-300 active:scale-95
        ${uploading ? "animate-pulse bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
      `}
    >
      {uploading ? (
        <span className="flex items-center gap-2">

          Uploading...
        </span>
      ) : "Upload File"}
    </button>

    </div>
    </div>
    
{/* CID Storage Section */}
    <div className="cid-container relative w-full max-w-[68rem]  mt-14 flex-col justify-between items-start px-4"> {/* max-w-4xl mt-10 p-6 bg-white rounded-xl shadow-lg flex  */}
  <h2 className="text-2xl font-medium text-gray-800 mb-4 text-left">
    Store CID on-chain
  </h2>

    <input 
    type="text"
    value={cid}
    onChange={(e) => setCid(e.target.value)} // Allows manual input
    placeholder="Enter the CID..."
    className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  {/* Copy Button Inside Input */}
  <button 
  onClick={handleCopy} 
  className="absolute right-3 top-[47%] -translate-y-1/2 px-7 py-5 text-gray-500 hover:text-gray-400 transition pointer-events-auto"
  disabled={!cid}
>
  {copied ? <FiCheck size={25} /> : <FiCopy size={25} />}
</button>

  <div className="flex mt-4  justify-end ">
  <button
  onClick={handleStoreCid}
  disabled={loading || !cid}
  className={`relative bg-blue-600 hover:bg-blue-500 text-white font-semibold mt-2 px-6 py-2 rounded-lg shadow-md transition-all duration-300 active:scale-95
  ${loading ? "animate-pulse bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
  `}
>
  {loading ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Storing...
    </span>
  ) : "Store CID"}
</button>


  </div>
</div>

      <ToastContainer />
  </div>
  );
}

export default UploadPage;
