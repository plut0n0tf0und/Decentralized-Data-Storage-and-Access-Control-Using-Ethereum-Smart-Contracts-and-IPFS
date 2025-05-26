import React, { useState } from "react";
import { ethers } from "ethers";
import CIDStorage from '../contracts/CIDStorage.json';
import '../components/StorageApp';
import CIDLinkButton from '../components/CIDLinkButton'; // or adjust the path as needed

const contractAddress = "0x762A40e84caBf7eeA283FfDC5EB6114DFf90624A";

function StorageApp() {
  const [inputCID, setInputCID] = useState(""); // CID entered for storing
  const [enteredCID, setEnteredCID] = useState(""); // CID entered by viewer
  const [storedCID, setStoredCID] = useState(""); // CID retrieved from contract
  const [url, setUrl] = useState(""); // IPFS URL for displaying files


  // Function for storing a CID in the contract
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
      setInputCID(""); // Clear the input field
    } catch (error) {
      if (error?.code === 4001) {
        alert("Transaction cancelled by user 🛑");
      } else {
        console.error("❌ Error storing CID:", error);
        alert(`Error: ${error.reason || "Something went wrong while storing the CID."}`);
      }
    }
  }

  // Function for retrieving the CID from the contract (stored by uploader)
  async function getCID() {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);

      const cid = await contract.getCID();
      if (!cid || cid === "") throw new Error("CID is empty");

      console.log("🧾 Stored CID:", cid);
      setStoredCID(cid);
      setUrl(`https://ipfs.io/ipfs/${cid}`);
    } catch (err) {
      console.error("❌ Error fetching CID:", err);
      alert(err.message || "Error fetching CID.");
    }
  }

  // Function for displaying a file using a shared CID (direct viewer access)
  async function showSharedCID() {
    if (!enteredCID.trim()) return alert("Please enter a valid CID");

    try {
      const url = `https://ipfs.io/ipfs/${enteredCID}`;
      console.log("📡 Accessing file at:", url);

      // Optionally verify CID validity by making a fetch request
      const response = await fetch(url);
      if (!response.ok) throw new Error("File not found or invalid CID");

      setUrl(url); // Update the file URL for display
      alert("File preview ready!");
    } catch (error) {
      console.error("❌ Error displaying shared CID:", error);
      alert(error.message || "Unable to fetch file from CID.");
    }
  }

  
  
  return (
    <div className="app">
      <h1 className="title">Decentralized CID Storage</h1>
  
      <div className="section">
        <h2 className="subtitle">Store CID</h2>
        <input
          type="text"
          placeholder="Enter CID to store"
          value={inputCID}
          onChange={(e) => setInputCID(e.target.value)}
          className="input-field"
        />
        <button onClick={setCID} className="button">Store CID</button>
      </div>
  
      <div className="section">
        <h2 className="subtitle">Retrieve Stored CID</h2>
        <button onClick={getCID} className="button">Show Stored CID</button>
        {storedCID && (
          <div> <p className="text">Stored CID: {storedCID}</p>
          <CIDLinkButton cid={storedCID} />
          </div>
        )}

      </div>
  
      <div className="section">
        <h2 className="subtitle">View File by Shared CID</h2>
        <input
          type="text"
          placeholder="Enter CID to view"
          value={enteredCID}
          onChange={(e) => setEnteredCID(e.target.value)}
          className="input-field"
        />
        <button onClick={showSharedCID} className="button">View File</button>
        {url && (
  <div className="text-center mt-6">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl text-lg font-semibold shadow-md hover:scale-105 transition-all inline-block"
    >
      View File 🔗
    </a>
    <p className="mt-2 text-sm text-gray-600 break-words">{url}</p>
  </div>
)}

      </div>
    </div>
  );    
}

export default StorageApp;