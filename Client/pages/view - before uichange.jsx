import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import AccessDisabled from '../components/AccessDisabled';
import LoadingSpinner from '../components/LoadingSpinner';
import Lighthouse from '../components/Lighthouse';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnterCID, { isValidCID } from '../components/EnterCID';
import { FiCopy } from "react-icons/fi";  // Feather Icons - Minimal & Clean
import { FiCheck } from "react-icons/fi"; // Tick Icon
import FileViewer from '../components/FileViewer'; // ✅ import added
import ErrorDisplay from '../components/ErrorDisplay';
import Swal from 'sweetalert2';



const ViewPage = () => {
const {cid: paramCID } = useParams(); // get cid from URL
const [customName, setCustomName] = React.useState('');
const [cid, setCID] = useState('');
const [secretKey, setSecretKey] = useState('');
const [status, setStatus] = useState(null);
const [loading, setLoading] = useState(false);
const [fileData, setFileData] = useState(null);
const [logs, setLogs] = useState([]);
const [walletAddress, setWalletAddress] = useState('');
const [currentUserWallet, setCurrentUserWallet] = useState(null);
const [targetWalletInput, setTargetWalletInput] = useState('');
const [uploadedCid, setUploadedCid] = useState('');
const [viewers, setViewers] = useState([]);


const showGlassToast = (msg) => {
  toast.error(msg, {
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "colored",
    transition: Slide,
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
    transition: Slide,
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

  useEffect(() => {
    if (paramCID) {
      setCID(paramCID);
    }
  }, [paramCID]);



const revokeAccess = async (walletToRemove) => {
  console.log("Trying to revoke:", walletToRemove);
    const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You are about to revoke access for ${walletToRemove}. This action cannot be undone.`,
    showCancelButton: true,
    confirmButtonColor: '#3085d6', // Metamask-ish blue
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, revoke it!',
    cancelButtonText: 'No, keep it',
    reverseButtons: true,
  });


  if (!result.isConfirmed) {
  Swal.fire({
    title: 'Cancelled',
    text: 'Your access revocation was cancelled.',
    timer: 1700, // 1.5 seconds
    showConfirmButton: true,
  });    return;
  }
  
  try {
    console.log('Revoke body:', { walletToRemove, requester: walletAddress });

    const res = await fetch('http://localhost:5000/api/wallet/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletToRemove,
        requester: walletAddress,
      }),
    });

    const data = await res.json();

    if (data.success) {
      showGlassToastError('Access revoked successfully');
      fetchFileAccess(walletAddress); // refresh after murder
    } else {
      toast.error(data.message || 'Failed to revoke');
    }
  } catch (err) {
    console.error('❌ Revoke error:', err);
    toast.error('Failed to revoke');
  }
};



const fetchFileAccess = async (wallet) => {
  try {
    const res = await fetch(`http://localhost:5000/api/wallet/uploader-access/${wallet}`);
    const data = await res.json();

    if (data.success) {
      const rawViewers = data.files.flatMap(file =>
        file.allowedViewers
          .filter((_, i) => i > 0) // skip uploader at index 0
          .map(viewer => {
            if (typeof viewer === 'string') {
              return { wallet: viewer, grantedAt: null, cid: file.cid, name: null };
            } else {
              return {
                wallet: viewer.wallet,
                grantedAt: viewer.grantedAt || null,
                cid: file.cid,
                name: viewer.name || null, // <-- force include name
              };
            }
          })

      );

      const uniqueMap = new Map();

      rawViewers.forEach(viewer => {
        if (!uniqueMap.has(viewer.wallet)) {
          uniqueMap.set(viewer.wallet, viewer); // keeps first occurrence
        }
      });

      const uniqueViewers = Array.from(uniqueMap.values());
      console.log("👀 uniqueViewers with names:", uniqueViewers);

      setViewers(uniqueViewers);
      setViewers([...uniqueViewers]); // forces refresh

    } else {
      toast.error('Failed to load viewer list');
    }
  } catch (err) {
    console.error('💥 Error fetching access list:', err);
    toast.error('Something went wrong loading access list');
  }
};


// auto-fetch once wallet is ready (like after refresh)
useEffect(() => {
  if (walletAddress) {
    fetchFileAccess(walletAddress);
  }
}, [walletAddress]);


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
    console.log("BODY SENT TO API:", {
      uploaderWallet,
      viewerWallet,
      customName: customName,
    });

    const res = await fetch('http://localhost:5000/api/giveaccess/give-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploaderWallet,
        viewerWallet,
        customName: customName, 
      }),
    });

    const data = await res.json();

      if (res.ok) {
        showGlassToastError(`Access Granted for ${targetWalletInput}!`);
        if (cid) fetchFileAccess(cid, walletAddress);

      // Refresh viewers list after granting access:
      setViewers(prev => [...prev, { wallet: viewerWallet, grantedAt: new Date().toISOString() }]);
      setTargetWalletInput(''); // Clear input if you want
      setCustomName(''); // Clear that custom name too

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
            placeholder="Custom Name (optional)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="px-4 py-2 h-[42px] rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
            style={{ minWidth: '200px' }}
          />

          <motion.input
            type="text"
            placeholder="Enter Wallet Address"
            value={targetWalletInput}
            onChange={(e) => setTargetWalletInput(e.target.value)}
            className="px-4 py-2 h-[42px] rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
            animate={{
              width: targetWalletInput.length > 0 ? 300 : 200,
            }}
            style={{ minWidth: '200px' }}
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
      <div className="w-full max-w-6xl mt-10 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 pl-2">Access History</h2>
        <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md shadow-xl border border-white/30">
          <table className="w-full text-left text-medium text-black-100">
            <thead className="bg-white/10 text-black-300 border-b border-white/20">
              <tr>
                <th className="px-10 py-5 w-[22%]">Name</th>
                <th className="px-6 py-5 w-[30%]">Wallet Address</th>
                <th className="px-6 py-5 w-[25%]">Granted At</th>
                <th className="px-7 py-5 w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {viewers.map((viewer, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="px-10 py-6 font-mono ">{viewer.name }</td>
                  <td className="px-6 py-6 font-mono ">{viewer.wallet}</td>
                  <td className="px-6 py-6">{viewer.grantedAt ? new Date(viewer.grantedAt).toLocaleString() : '-'}</td>
                  <td className="px-4 py-6">
                    <button
                      className="bg-white text-black font-xl border border-black py-1 px-4 rounded-md transition duration-200 hover:bg-red-500 hover:text-white"
                      onClick={() => revokeAccess(viewer.wallet)}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
