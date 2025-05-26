import React, { useState } from "react";
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";
import CIDLinkButton from "../components/CIDLinkButton";

const contractAddress = "0x762A40e84caBf7eeA283FfDC5EB6114DFf90624A";

function ViewPage() {
  const [storedCID, setStoredCID] = useState("");
  const [enteredCID, setEnteredCID] = useState("");
  const [url, setUrl] = useState("");

  async function getCID() {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);

      const cid = await contract.getCID();
      if (!cid || cid === "") throw new Error("CID is empty");

      setStoredCID(cid);
      setUrl(`https://gateway.lighthouse.storage/ipfs/${cid}`); //to show url at page

    } catch (err) {
      console.error("❌ Error fetching CID:", err);
      alert(err.message || "Error fetching CID.");
    }
  }

  async function showSharedCID() {
    if (!enteredCID.trim()) return alert("Please enter a valid CID");

    try {
      const sharedUrl = `https://gateway.lighthouse.storage/ipfs/${enteredCID}`;
      const response = await fetch(sharedUrl);
      if (!response.ok) throw new Error("File not found or invalid CID");

      setUrl(sharedUrl);
      alert("File preview ready!");
    } catch (error) {
      console.error("❌ Error displaying shared CID:", error);
      alert(error.message || "Unable to fetch file from CID.");
    }
  }

  return (
    <div className="app">
      <div className="section">
        <h2 className="subtitle">Retrieve Stored CID</h2>
        <button onClick={getCID} className="button">Show Stored CID</button>
        {storedCID && (
          <div>
            <p className="text">Stored CID: {storedCID}</p>
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

export default ViewPage;
