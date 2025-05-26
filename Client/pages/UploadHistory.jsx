import { useEffect, useState } from "react";
import { FiTrash2, FiCheck, FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import CIDStorage from "../contracts/CIDStorage.json";
import Swal from 'sweetalert2';


const contractAddress = "0xa8DD954495C9AbaE175d2838f03C5b12BC97aA09"; // <-- put your deployed Sepolia address here

const UploadHistory = () => {
  const [copied, setCopied] = useState('');
  const [history, setHistory] = useState([]);
  const [wallet, setWallet] = useState("");

const handleView = async (file) => {
  try {
    const res = await fetch(`/api/view/${file.cid}?wallet=${wallet}`);

    if (res.status === 404) {
      // File not in DB → open public IPFS link
      window.open(`https://gateway.lighthouse.storage/ipfs/${file.cid}`);
      return;
    }

    if (!res.ok) {
      const errMsg = await res.text();
      toast.error(`View failed: ${errMsg}`);
      return;
    }

const blob = await res.blob();
const mime = blob.type;

const url = URL.createObjectURL(blob);

// Don't open window first – wait to know the MIME
if (mime.startsWith("image/")) {
  const win = window.open();
  if (!win) {
    toast.error("Popup blocked. Enable popups!");
    return;
  }
  win.document.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            background: #111;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            box-shadow: 0 0 20px rgba(255,255,255,0.2);
          }
        </style>
      </head>
      <body>
        <img src="${url}"  oncontextmenu="return false;" />
      </body>
    </html>
  `);
} else if (mime === "application/pdf") {
  const win = window.open();
  if (!win) {
    toast.error("Popup blocked. Enable popups!");
    return;
  }
  win.document.write(`
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: #111;
          }
          embed {
            display: block;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <embed src="${url}" type="application/pdf" />
      </body>
    </html>
  `);
} else if (mime.startsWith("text/")) {
  const text = await blob.text();
  const win = window.open();
  if (!win) {
    toast.error("Popup blocked. Enable popups!");
    return;
  }
  win.document.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #111;
            color: #f0f0f0;
            font-family: monospace;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        ${text}
      </body>
    </html>
  `);
  win.document.close();
} else {
  // No more `window.open()` at the top – just open direct tab here
  window.open(`https://gateway.lighthouse.storage/ipfs/${file.cid}`, "_blank");
}


  } catch (err) {
    console.error("View error:", err);
    toast.error("Something went wrong viewing this file");
  }
};


const handleDelete = async (file) => {
  console.log('🗑️ Deleting file:', file);

  if (!wallet) {
    toast.error("Wallet not connected! Please connect your wallet first.");
    return;
  }

    const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You're about to delete the file: "${file.filename || file.cid}". This cannot be undone.`,
    showCancelButton: true,
    confirmButtonColor: '#004687',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true,
  });

  if (!result.isConfirmed) {
    await Swal.fire({
      title: 'Cancelled',
      text: 'File deletion was cancelled.',
      timer: 1700,
      showConfirmButton:false,
    });
    return;
  }

  try {
    const isOnChain = typeof file.index === "number";

    if (!isOnChain) {
      // DB Deletion
      const res = await fetch(`/api/history/${file.cid}/${wallet}`, { method: "DELETE" });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      toast.success("Deleted from DB ");
    } else {
      // ON-CHAIN DELETION
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      if (signerAddress.toLowerCase() !== file.uploaderWallet.toLowerCase()) {
        toast.error("You ain't the uploader! 🚫");
        return;
      }

      const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);

      try {
        const tx = await contract.deleteFile(file.index);
        console.log("🔥 TX sent:", tx.hash);
        await tx.wait();
        toast.success("Zapped on-chain file ⚡");
      } catch (txErr) {
        console.error("On-chain tx error:", txErr);
        toast.error("On-chain deletion failed");
        return;
      }
    }

    // Update UI — remove deleted file from history list
    setHistory((prev) => prev.filter((f) => f.cid !== file.cid));

  } catch (err) {
    console.error("Deletion failed:", err);
    toast.error("Deletion failed");
  }
};




const fetchHistory = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CIDStorage.abi, signer);

  let dbFormatted = [];
  let onChainFormatted = [];
  let userWallet = "";

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    userWallet = accounts[0].toLowerCase();
    setWallet(userWallet);

    // DB fetch
    const res = await fetch(`/api/history/${userWallet}`);
    const data = await res.json();
    if (!data.success) throw new Error("Couldn’t fetch DB");

    const filtered = data.files.filter(
      (file) =>
        file.uploaderWallet.toLowerCase() === userWallet ||
        file.allowedViewers.some((v) => v?.wallet.toLowerCase() === userWallet)
    );

    dbFormatted = filtered.map((file) => ({
      filename: file.filename,
      createdAt: file.createdAt ? new Date(file.createdAt).toISOString() : new Date().toISOString(),
      cid: file.cid,
      uploaderWallet: file.uploaderWallet,
      encrypted: file.decryptionKey ? "Yes" : "No",
      index: null,
    }));
    console.log("✅ DB Files:", dbFormatted);
  } catch (err) {
    console.error("🔥 DB fetch error:", err);
    toast.error("DB fetch went to hell");
  }

try {
  // 🔍 On-chain fetch (tuple-style)
  const [filenames, cids, uploaders] = await contract.getAllFiles();
  console.log("📦 Raw on-chain files:", { filenames, cids, uploaders });

  if (!Array.isArray(filenames) || !Array.isArray(cids) || !Array.isArray(uploaders)) {
    throw new Error("Contract returned invalid data format");
  }

  onChainFormatted = filenames.map((filename, i) => ({
    filename,
    cid: cids[i],
    uploaderWallet: uploaders[i].toLowerCase(),
    encrypted: "",
    index: i,
    createdAt: new Date().toISOString(), // fake time for now


  })).filter((file) => file.uploaderWallet === userWallet);

  console.log("✅ On-chain Files:", onChainFormatted);
} catch (err) {
  console.error("On-chain fetch error:", err);
  toast.error("Chain fetch exploded 💥");
}


  setHistory([...dbFormatted, ...onChainFormatted]);
};


useEffect(() => {
  fetchHistory();
}, []);


  const handleCopy = (cid) => {
  navigator.clipboard.writeText(cid);
  setCopied(cid);
  setTimeout(() => setCopied(false), 1500);
};

return (
  <div className="p-4">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-6 pl-2">Upload History</h2>

    <div className="overflow-x-auto rounded-xl bg-white shadow-md border border-gray-200 mr-6">
      <table className="w-full text-left text-gray-700 table-auto">
        <thead className="bg-gray-100 border-b border-gray-300 text-sm uppercase tracking-wide">
          <tr>
            <th className="px-4 py-5 w-[300px]">File</th>
            <th className="px-4 py-5">Uploaded On</th>
            <th className="px-4 py-5 w-[400px]">CID</th>
            <th className="px-4 py-5 w-[200px] text-left">Encryption</th>
            <th className="px-4 py-5 w-[240px] text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {history.map((file, i) => (
            <tr key={i} className="border-t border-gray-200 hover:bg-gray-50 transition">
              <td className="px-4 py-6 w-[300px] font-mono break-words whitespace-normal text-gray-800">
                {file.filename}
              </td>
              <td className="px-4 py-6 w-[180px] whitespace-nowrap font-mono text-gray-600">
                <div className="flex flex-col leading-snug">
                  <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(file.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </td>
              <td className="px-4 py-6 w-[300px] break-all flex items-center gap-2 ">
                <span>{file.cid}</span>
                <button onClick={() => handleCopy(file.cid)}>
                  {copied === file.cid ? (
                    <FiCheck size={22} className="text-green-500 transition-transform scale-110" />
                  ) : (
                    <FiCopy size={22} className="text-gray-600 hover:text-gray-800 transition-transform hover:scale-110" />
                  )}
                </button>
              </td>

              <td className="px-4 py-6 w-[100px] pl-12 text-centre text-gray-700">
                {file.encrypted}
              </td>

              <td className="px-4 py-6 w-[140px]  text-centre">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2 "
                >
                  <button
                    onClick={() => handleView(file)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
                  >
                    View
                  </button>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      console.log('🗑️ Deleting file:', file);
                      await handleDelete(file);
                    }}
                    className="px-6 py-3 rounded-md bg-white  text-gray-700 hover:bg-red-100 flex items-center gap-2 transition-colors duration-200"
                    title="Delete File"
                  >
                    <FiTrash2 size={18} className="text-gray-600 hover:text-red-600" />
                    <span className="sr-only">Delete</span>
                  </button>
                </motion.div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default UploadHistory;