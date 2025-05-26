import React, { useState, useEffect, useRef } from 'react';
import { uploadFileToLighthouse } from '../services/lighthouse';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './upload.css';
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";

const contractAddress = "0x762A40e84caBf7eeA283FfDC5EB6114DFf90624A";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cid, setCid] = useState(null);
  const [isStored, setIsStored] = useState(false);
  const maxSizeMB = 10;
  const fileInputRef = useRef(null);

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
    toast.info("File selection canceled ❌");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected, bruh");
      return;
    }
    try {
      setUploading(true);
      setProgress(30);
      const cid = await uploadFileToLighthouse(file);
      setCid(output.data.Hash);  // <- this sets CID
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

      const tx = await contract.storeCID(cid);
      await tx.wait();

      toast.success("CID stored successfully on-chain! 🔥");
      setIsStored(true);
    } catch (error) {
      if (error?.code === 4001) {
        toast.error("Transaction cancelled by user 🛑");
      } else {
        console.error("❌ Error storing CID:", error);
        toast.error(`Error: ${error.reason || "Something went wrong storing CID"}`);
      }
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
    <div className="upload-container">
      <div className="upload-box" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}>
        <input id="fileInput" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <p className="upload-text-title">Drag & Drop the file</p>
        <p className="upload-text-sub">(or click here to choose)</p>
      </div>

      {file && (
      <div className="file-actions-row flex items-center justify-between w-full max-w-3xl mt-4 px-4">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-800 break-words">{file.name}</p>
          <button onClick={handleCancel} className="text-red-500 font-semibold hover:underline text-sm mt-1">
            Cancel File
          </button>
        </div>
        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    )}

    {/* Upload Button - Always Visible */}
    <div className="w-full max-w-3xl px-4 mt-2 text-right">
      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
          file ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>

    {cid && (
      <div className="cid-info mt-6 text-center w-full max-w-3xl">
        <p className="mb-2 break-all text-gray-800 font-mono">CID: {cid}</p>
        <a href={`https://gateway.lighthouse.storage/${cid}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all block mb-2">
          View File 🔗
        </a>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(cid);
              toast.success("CID copied to clipboard! 📋");
            }} 
            className="store-cid-button"
          >
            Copy CID
          </button>
          {!isStored && (
            <button onClick={handleStoreCid} className="store-cid-button">Store CID in MetaMask</button>
          )}
        </div>
      </div>
    )}


      <ToastContainer />
    </div>
  );
}

export default UploadPage;
