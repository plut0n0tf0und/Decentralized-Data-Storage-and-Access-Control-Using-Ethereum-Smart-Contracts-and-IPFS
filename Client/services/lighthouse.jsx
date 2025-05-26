import lighthouse from '@lighthouse-web3/sdk';
import CryptoJS from "crypto-js";
// @ts-ignore
import { randomBytes } from 'crypto-browserify';
const API_KEY = '5f86d2eb.b440f07ceab7420cb1fdaf5e8c6828a6'; // 👈 paste your key

  export const uploadFileToLighthouse = async (file, uploaderWallet) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploaderWallet", uploaderWallet);
      formData.append("isEncrypted", "true");

      const response = await fetch("http://localhost:5000/api/upload/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Upload failed");

      alert("✅ File uploaded! CID: " + data.cid);
      return data.cid;
    } catch (err) {
      console.error("💥 Normal upload error:", err);
      throw err;
    }
  };

/**
 * Encrypts and uploads file, then gives uploader access
 * @param {File} file - File to upload
 * @param {string} uploaderWallet - Address of uploader
 * @returns {string} cid - CID of uploaded encrypted file
 */
export const uploadEncryptedFile = async (file, uploaderWallet) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaderWallet", uploaderWallet);

    const response = await fetch("http://localhost:5000/api/upload/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Upload failed");
    }

    alert("✅ File uploaded! CID: " + data.cid);
    console.log("📦 Uploaded encrypted file:", data);
    return data.cid;
  } catch (err) {
    console.error("💥 Encrypted upload error:", err);
    throw err;
  }
};

