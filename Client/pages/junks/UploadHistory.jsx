import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const UploadHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const wallet = accounts[0];
        const res = await fetch(`/api/history/${wallet}`);
        const data = await res.json();
        if (!data.success) throw new Error("Couldn’t fetch");

        setHistory(data.files);
      } catch (err) {
        toast.error("Couldn't load history 💥");
      }
    };

    fetchHistory();
  }, []);

  const copyToClipboard = (cid) => {
    navigator.clipboard.writeText(cid);
    toast.success("CID copied!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📁 Upload History</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>📄 File</th>
            <th>🕓 Date</th>
            <th>🪪 CID</th>
            <th>🔐 Encrypted</th>
            <th>🔍 Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((file, i) => (
            <tr key={i} className="text-center border-t">
              <td>{file.filename}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
              <td>
                <span className="break-all text-sm">{file.cid}</span>
                <button onClick={() => copyToClipboard(file.cid)}>📋</button>
              </td>
              <td>{file.isEncrypted ? 'Yes' : 'No'}</td>
              <td>
                <a
                  href={`http://localhost:5000/api/view/${file.cid}?wallet=${file.uploaderWallet}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadHistory;
