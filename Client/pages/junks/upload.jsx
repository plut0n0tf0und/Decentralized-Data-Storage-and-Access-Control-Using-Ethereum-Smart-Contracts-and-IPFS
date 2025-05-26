import React, { useState } from "react";
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";
import { uploadFileToLighthouse } from "../services/lighthouse";  // Import the service
import { useNavigate } from 'react-router-dom';

const contractAddress = "0x762A40e84caBf7eeA283FfDC5EB6114DFf90624A";

function UploadPage() {
  const [inputCID, setInputCID] = useState("");
  const [file, setFile] = useState(null);
  const [cidToCopy, setCidToCopy] = useState("");

  // Inside your UploadPage component
const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload!");
  
    try {
      const response = await uploadFileToLighthouse(file);
      console.log("handleUpload got response 👉", response); // will now show full link
  
      const cid = response?.split("/").pop(); // 🎯 Extract CID from full URL
      if (!cid) throw new Error("Invalid CID received");
  
      setInputCID(cid);
      setCidToCopy(cid);
      alert(`File uploaded successfully! CID: ${cid}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const handleCancelFile = () => {
    setFile(null);
  };
  

  async function setCID() {
    if (!window.ethereum) return alert("Please install MetaMask");
    if (!inputCID.trim()) return alert("Enter a valid CID");

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);

      const tx = await contract.storeCID(inputCID);
      await tx.wait();

      alert("CID Stored Successfully!");
      setInputCID(""); // Clear CID after successful storage
    } catch (error) {
      if (error?.code === 4001) {
        alert("Transaction cancelled by user 🛑");
      } else {
        console.error("❌ Error storing CID:", error);
        alert(`Error: ${error.reason || "Something went wrong while storing the CID."}`);
      }
    }
  }

  const handleCopyCID = () => {
    if (cidToCopy) {
      navigator.clipboard.writeText(cidToCopy);
      alert("CID copied to clipboard!");
    }
  };

  return (
    <div className="app">
      <h2 className="subtitle">Upload and Store CID</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="input-field"
      />
      {file && (
  <button onClick={handleCancelFile} style={{ marginTop: '10px' }}>
    ❌ Cancel Selected File
  </button>
)}
      <button onClick={handleUpload} className="button">Upload File</button>

      {inputCID && (
        <div>
          <p>Uploaded CID: {String(inputCID)}</p>
          <button onClick={handleCopyCID} className="button">Copy CID</button>
          <button onClick={setCID} className="button">Store CID</button>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
