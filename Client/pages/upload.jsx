import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './upload.css';
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";
import { FiCopy } from "react-icons/fi";  // Feather Icons - Minimal & Clean
import { FiCheck } from "react-icons/fi"; // Tick Icon
import { uploadFileToLighthouse, uploadEncryptedFile } from '../services/lighthouse';

const contractAddress = "0xa8DD954495C9AbaE175d2838f03C5b12BC97aA09";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cid, setCid] = useState("");
  const [isStored, setIsStored] = useState(false);
  const maxSizeMB = 50;
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [encrypt, setEncrypt] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [filename, setFilename] = useState("");



// Assuming you have a state for secretKey:
const [secretKey, setSecretKey] = useState('');

const handleDragEnter = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(true); // 👈 activate blur
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false); // 👈 remove blur
};
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsDragging(false); // 👈 clean up blur
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size / (1024 * 1024) > maxSizeMB) {
      toast.error("File too large! Max 50MB allowed 🚫",{
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
      transition: Slide, // 👑 the smooth operator
    });

      return;
    }
    setFile(droppedFile); 
    toast.success(`File selected: ${droppedFile.name}`,{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size / (1024 * 1024) > maxSizeMB) {
      toast.error("File too large! Max 50MB allowed 🚫",{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
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
        transition: Slide,
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
    toast.error("No file selected",{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
    return;
  }

  try {
    setUploading(true);
    setProgress(30);

    if (!window.ethereum) {
      toast.error("Metamask not found",{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
      setUploading(false);
      setProgress(0);
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];

    if (!walletAddress) {
      toast.error("Wallet not connected",{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
      setUploading(false);
      setProgress(0);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaderWallet', walletAddress);
    formData.append('isEncrypted', encrypt);
    console.log("Uploading to http://localhost:5000/api/upload/upload");
    const response = await fetch('http://localhost:5000/api/upload/upload', {
      method: 'POST',
      body: formData,
    });


    const data = await response.json();

    if (!data.success || !data.cid) {
      throw new Error("Invalid response from server");
    }

    setCid(data.cid);
    setSecretKey(encrypt ? data.decryptionKey : "None");
    setProgress(100);

    toast.success(
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        🎉 File uploaded!
      </motion.div>
    );

    setFile(null);
    document.getElementById('fileInput').value = null;

  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Upload failed 💥",{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
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

  if (!cid || !cid.trim() || !filename || !filename.trim()) {
    toast.error("CID or filename is empty or invalid");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("Signer Address:", address);

    const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);
    const ownerAddress = await contract.owner();

    if (ownerAddress.toLowerCase() !== address.toLowerCase()) {
      toast.error("You ain't the contract owner, no CID storage for you 🤷‍♀️");
      return;
    }

    console.log("🟡 Filename:", filename);
    console.log("🟡 CID:", cid);
    const tx = await contract.storeCID(filename, cid, { gasLimit: 500000 });
    console.log("🟡 Tx sent:", tx.hash);

    const toastId = toast.loading("Waiting for confirmation...");
    const receipt = await tx.wait();
    toast.dismiss(toastId);

    if (receipt && receipt.blockNumber) {
      console.log("✅ Confirmed in block:", receipt.blockNumber);
      toast.success("CID + Filename stored on-chain!");
      setIsStored(true);
    } else {
      toast.error("Transaction may not be mined. Try again.");
    }
  } catch (error) {
    if (error?.code === 4001) {
      toast.error("Transaction cancelled by user");
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
        toast.error("File too large! Max 50MB allowed 🚫");
        return;
      }
      setFile(droppedFile); 
      toast.success(`File selected: ${droppedFile.name}`,{
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  transition: Slide, // 👑 the smooth operator
});
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const UploadPage = () => {
  const [inputText, setInputText] = useState("");

  // Load saved text when the component mounts
  useEffect(() => {
    const savedText = localStorage.getItem("uploadText");
    if (savedText) setInputText(savedText);
  }, []);

  // Save text on change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    localStorage.setItem("uploadText", e.target.value);
  }
  };

return (
  <div className="page-container-light">
    {/* Upload Section */}
    <div className="file-actions-row flex-col justify-between w-full max-w-[70rem] px-4">
          <h2 className=" text-2xl font-semibold	 text-gray-800 mb-4 text-left self-start ">
            Upload a file
          </h2>
        <div className={`upload-box-light ${isDragging ? 'drag-active' : ''}`}

          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            id="fileInput"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="upload-text-title">Drag & Drop the file to upload it on IPFS</p>
          <p className="upload-text-sub">(or click the box)</p>
        </div>
      <div className="file-actions-row flex justify-between w-full max-w-[68rem] mt-3 items-center">
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

    {/* Grouping checkbox & upload button together */}
    <div className="flex items-center mt-2 gap-6">
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        <input
          type="checkbox"
          checked={encrypt}
          onChange={() => setEncrypt(!encrypt)}
          className="w-6 h-6 accent-blue-500"
        />
        
        <span className="text-lg">Encrypt file</span>
      </label>

      <button 
        onClick={handleUpload}
        className={`relative bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-[45px] rounded-lg shadow-md transition-all duration-300 active:scale-95
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

    </div>
    

      {/* CID Storage Section */}
      <div className="file-actions-row flex-col justify-between w-full max-w-[70rem] px-4">
        <h2 className="text-2xl font-semibold mb-6 mt-14 text-gray-800 w-full max-w-[70rem]">
          Store CID on-chain
        </h2>
      </div>

<div className="flex flex-wrap items-center gap-4 mb-9 w-full max-w-[76rem] px-4">
  <input
    type="text"
    placeholder="Name (optional)"
    value={filename}
    onChange={(e) => setFilename(e.target.value)}
    className="w-full max-w-[14rem] border-2 border-blue-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  <div className="relative w-full max-w-[44rem]">
    <input
      type="text"
      value={cid}
      onChange={(e) => setCid(e.target.value)}
      placeholder="Enter the CID..."
      className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button 
      onClick={handleCopy} 
      className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-5 text-gray-500 hover:text-gray-400 transition pointer-events-auto"
      disabled={!cid}
    >
      {copied ? (
        <FiCheck size={25} className="text-green-500" strokeWidth={3} />
      ) : (
        <FiCopy size={25} />
      )}
    </button>
  </div>

  <button
    onClick={handleStoreCid}
    disabled={loading || !cid}
    className={`h-[45px] px-7 py-2 bg-blue-600 font-semibold text-white rounded-lg shadow-md  hover:bg-blue-700 transition-all duration-300 ease-in-out
      ${loading ? "animate-pulse bg-gradient-to-r from-blue-600 to-indigo-600" : ""}`}
  >
    {loading ? (
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="blue" strokeWidth="4" />
          <path className="opacity-75" fill="blue" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Storing...
      </span>
    ) : "Store CID"}
  </button>
      <p className="pl-2 text-sm text-gray-500">
      Note: Using shorter names helps save gas fees.
    </p>
</div>
        <ToastContainer />
      </div>

  );
}

export default UploadPage;
