import express from 'express';
import FileAccess from './FileAccess.js';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

const decryptRoutes = express.Router();

decryptRoutes.post('/', async (req, res) => {
  const { cid, walletAddress } = req.body;

  if (!cid || !walletAddress) {
    return res.status(400).json({ success: false, message: 'Missing cid or walletAddress' });
  }

  try {
    // 🛡 Check access
    const access = await FileAccess.findOne({
      cid,
      $or: [
        { walletAddress },
        { uploaderWallet: walletAddress }
      ]
    });

    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // 🔑 Decrypt the file
    const { data: encryptedContent } = await axios.get(`https://gateway.lighthouse.storage/ipfs/${cid}`);
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, access.decryptionKey);
    const decoded = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decoded) {
      return res.status(500).json({ success: false, message: 'Failed to decrypt. Key might be wrong or data broken' });
    }

    // 🪄 Send decrypted content
    res.json({ success: true, content: decoded });

  } catch (err) {
    console.error('💥 Decryption failed:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default decryptRoutes;
