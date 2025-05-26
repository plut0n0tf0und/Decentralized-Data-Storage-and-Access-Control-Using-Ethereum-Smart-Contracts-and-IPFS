import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AccessDisabled from '../components/AccessDisabled';
import LoadingSpinner from '../components/LoadingSpinner';
import Lighthouse from '../components/Lighthouse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnterCID, { isValidCID } from '../components/EnterCID';
import { FiCopy } from "react-icons/fi";  // Feather Icons - Minimal & Clean
import { FiCheck } from "react-icons/fi"; // Tick Icon
import FileViewer from '../components/FileViewer'; // ✅ import added
import ErrorDisplay from '../components/ErrorDisplay';


const ViewPage = () => {
  const [cid, setCID,secretKey] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentUserWallet, setCurrentUserWallet] = useState(null);
  const [targetWalletInput, setTargetWalletInput] = useState('');
  const [uploadedCid, setUploadedCid] = useState('');


const showGlassToast = (msg) => {
  toast.error(msg, {
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "colored",
  });
};

const showGlassToastError = (msg) => {
  toast.error(msg, {
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    type: "success",
    theme: "colored",
  });
};

const handleCIDSubmit = async (enteredCID) => {
const isValidCID = /^[a-zA-Z0-9]{46,}$/.test(enteredCID);

  if (!isValidCID) {
    showGlassToast("Enter a valid CID");
    return;
  }

  setLoading(true);
  setCID(enteredCID);
  const fileUrl = `http://localhost:5000/api/view/${enteredCID}?wallet=${walletAddress}`;

  try {
    window.open(fileUrl, '_blank');
    setStatus('active');
  } catch (err) {
    console.error('💀 Fetch failed:', err);
    setStatus('inactive');
  }

  setLoading(false);
};

  useEffect(() => {
    const getWallet = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentUserWallet(accounts[0]);
      setWalletAddress(accounts[0]);
    };
    getWallet();
  }, []);


  const copyToClipboard = (cid) => {
    navigator.clipboard.writeText(cid);
    alert('CID copied to clipboard!');
  };

    useEffect(() => {
    const getConnectedWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      }
    };
    getConnectedWallet();
  }, []);

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

const handleGiveAccess = async () => {
  console.log("clicked"); // <== Add this
if (!targetWalletInput) {
  showGlassToast("Enter Wallet Address");
  return;
}
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const uploaderWallet = accounts[0]?.toLowerCase();
    const viewerWallet = targetWalletInput.toLowerCase();

    if (!uploaderWallet) {
      showGlassToast('🚫 Wallet not connected, bruh.');
      return;
    }

    const res = await fetch('http://localhost:5000/api/giveaccess/give-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploaderWallet,
        viewerWallet,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showGlassToastError(`Access Granted for ${targetWalletInput}!`); 

    } else {
      showGlassToast(`❌ ${data.message}`);
    }
  } catch (err) {
    console.error('💥 Error granting access:', err);
    showGlassToast('⚠️ Server error. Try again later.');
  }
};



  const fetchLogsInChunks = async (startBlock, latestBlock) => {
    const logs = [];
    for (let i = startBlock; i < latestBlock; i += 500) {
      try {
        const chunkLogs = await fetchLogsFromBlockchain(i, Math.min(i + 499, latestBlock));
        logs.push(...chunkLogs);
      } catch (err) {
        console.error('Error fetching logs for block range:', i, err);
      }
    }
    return logs;
  };

  const fetchLogsFromBlockchain = async (fromBlock, toBlock) => {
    const res = await fetch(`/api/view/all/logs?fromBlock=${fromBlock}&toBlock=${toBlock}`);
    const data = await res.json();
    return data.logs;
  };

  useEffect(() => {
    const fetchLogsData = async () => {
      setLoading(true);
      const startBlock = 0;
      const latestBlock = 5000;

      try {
        const logsData = await fetchLogsInChunks(startBlock, latestBlock);
        setLogs(logsData);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogsData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center p-6">
      <motion.h1 className="text-3xl px-4 font-semibold mb-4 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        View Your File
      </motion.h1>
      
      <EnterCID onSubmit={handleCIDSubmit} />


      {/* Give Access UI */}
      <div className="flex items-center gap-3 mt-10">
        <motion.h1 className="text-3xl px-4 font-semibold mb-4 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Give Access to Your File
        </motion.h1>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <motion.input
          type="text"
          placeholder="Enter Wallet Address"
          value={targetWalletInput}
          onChange={(e) => setTargetWalletInput(e.target.value)}
          className="px-4 py-2 h-[42px] rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
          animate={{
            width: targetWalletInput.length > 0 ? 480 : 300,
          }}
          style={{ minWidth: '300px' }}
        />

        <motion.button
          onClick={handleGiveAccess}
          className="px-6 py-2 bg-blue-600 font-semibold text-white rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
          animate={{ x: targetWalletInput.length > 0 ? 10 : 0 }}
        >
          Give Access
        </motion.button>

      </div>

      <Lighthouse uploadedCid={uploadedCid} targetWallet={targetWalletInput} currentUserWallet={currentUserWallet} />

      {/* Logs Table */}
      <div className="w-full max-w-5xl mt-10 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 pl-2">Access History</h2>
        <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md shadow-xl border border-white/30">
          <table className="min-w-full text-left text-medium text-black-100">
            <thead className="bg-white/10 text-black-300 border-b border-white/20">
              <tr>
                <th className="px-6 py-4">Wallet Address</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="text-center py-6 text-indigo-300">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-6 text-indigo-300">No logs found</td></tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={idx} className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="px-6 py-4 break-all">{log.cid.slice(0, 10)}...{log.cid.slice(-5)}</td>
                    <td className="px-6 py-4">{new Date(log.timestamp * 1000).toLocaleString()}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => handleCIDSubmit(log.cid)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        View CID
                      </button>
                      <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md" onClick={() => copyToClipboard(log.cid)}>
                        Copy
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
