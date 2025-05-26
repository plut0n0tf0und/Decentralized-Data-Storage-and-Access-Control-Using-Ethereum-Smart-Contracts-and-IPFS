import React, { useState } from 'react';
import { uploadToNFTStorage } from '../services/nftStorageService';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const maxSizeMB = 10; // Max 10MB limit

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size / (1024 * 1024) > maxSizeMB) {
      toast.error("File too large! Max 10MB allowed 🚫");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected, bruh 🤦‍♂️");
      return;
    }

    try {
      setUploading(true);
      setProgress(30); // Fake small progress
      
      const cid = await uploadToNFTStorage(file);

      setProgress(100);
      toast.success(
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🎉 File uploaded! CID: {cid}
        </motion.div>
      );

      setFile(null); // clear file
    } catch (error) {
      console.error(error);
      toast.error("Upload failed 💥");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

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
  };

  const handleCancel = () => {
    setFile(null);
    toast.info("File selection canceled ❌");
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload / Store Files</h2>
      
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div style={{ margin: "20px" }}>
          <p>Selected File: {file.name}</p>
          <button onClick={handleCancel}>Cancel File</button>
        </div>
      )}

      {uploading && (
        <div style={{ margin: "20px" }}>
          <progress value={progress} max="100" />
          <p>Uploading... {progress}%</p>
        </div>
      )}

      <button onClick={handleUpload} disabled={uploading || !file}>
        Upload to Storage
      </button>

      <ToastContainer />
    </div>
  );
}

export default UploadPage;
