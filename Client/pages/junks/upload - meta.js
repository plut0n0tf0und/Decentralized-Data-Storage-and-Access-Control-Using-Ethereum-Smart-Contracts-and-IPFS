import React, { useState } from "react";
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";

const contractAddress = "0x762A40e84caBf7eeA283FfDC5EB6114DFf90624A";

function UploadPage() {
  const [inputCID, setInputCID] = useState("");

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
      setInputCID("");
    } catch (error) {
      if (error?.code === 4001) {
        alert("Transaction cancelled by user 🛑");
      } else {
        console.error("❌ Error storing CID:", error);
        alert(`Error: ${error.reason || "Something went wrong while storing the CID."}`);
      }
    }
  }

  return (
    <div className="app">
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
  );
}

export default UploadPage;
