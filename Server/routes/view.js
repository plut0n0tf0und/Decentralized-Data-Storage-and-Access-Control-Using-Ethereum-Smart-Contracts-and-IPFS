import express from 'express';
import FileAccess from '../routes/FileAccess.js';
import { Alchemy, Network } from 'alchemy-sdk';
import axios from 'axios';
import crypto from 'crypto';
import mime from 'mime-types';


const viewRoutes = express.Router();

const settings = {
  apiKey: 'Vo',
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

const handleGetFile = async (req, res) => {
  const requestedCid = req.params.cid;
  const viewerWallet = req.query.wallet?.toLowerCase();

  if (!requestedCid || !viewerWallet) {
    return res.status(400).json({ success: false, message: "🚫 Missing CID or wallet address!" });
  }

  try {
    const access = await FileAccess.findOne({ cid: requestedCid });

    console.log('🔥 HIT /api/view route:', requestedCid, viewerWallet);

      if (!access) {
        // ✅ Public file case — just return the IPFS URL clean
        return res.status(200).json({
          success: true,
          public: true,
          ipfsUrl: `https://gateway.lighthouse.storage/ipfs/${requestedCid}`
        });
      }


    // 🛡️ Enforce access control
    const isUploader = access.uploaderWallet === viewerWallet;
    const isAllowed = access.allowedViewers.some(v => v.wallet === viewerWallet);

    if (!isUploader && !isAllowed) {
      return res.status(403).json({ message: "❌ Access denied. You ain't on the guest list." });
    }

    const originalName = access.filename || 'file.txt';
    const mimeType = mime.lookup(originalName) || 'application/octet-stream';

    const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${requestedCid}`;
    const axiosResponse = await axios.get(ipfsUrl, { responseType: 'arraybuffer' });
    let fileBuffer = Buffer.from(axiosResponse.data);

    if (access.isEncrypted) {
      const key = crypto.createHash('sha256').update(String(access.decryptionKey)).digest().slice(0, 32);
      const iv = fileBuffer.slice(0, 16);
      const encryptedContent = fileBuffer.slice(16);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      fileBuffer = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
    }

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${originalName}"`,
    });

    res.send(fileBuffer);
  } catch (err) {
    console.error('Error fetching access or file:', err);
    return res.status(500).send(`
        <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Access Denied</title>
    <style>
      body {
        background-color: black;
        color: white;
        font-style: mono;
        padding: 20px;
      }
    h3 {
      margin-bottom: 34px;
    }
    ul {
      font-family: monospace;
      line-height: 1.8;
    }
    p {
      margin-top: 20px; 
      font-family: monospace;
    }
  </style>
</head>
<body>
<h3>Access denied. This wallet doesn't have permission to view this file</h3>
  <h4>Why can't you see the file?</h4>
    <ul>
      <li>This file is locked down safer than Area 51.</li>
      <li>Only wallet addresses given access by the uploader can view it.</li>
      <li>Ask the uploader to give you full access.</li>
      <li>Or switch wallet to the one they gave access to.</li>
    </ul>
    <p>Peace ✌️</p>
  </body>
  </html>
`);
};
};


viewRoutes.get('/fileaccess/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const file = await FileAccess.findOne({ cid });
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    res.json({ success: true, file });
  } catch (err) {
    console.error('Error fetching file access:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


const handleGetLogs = async (req, res) => {
  const { fromBlock, toBlock } = req.query;

  if (!fromBlock || !toBlock) {
    return res.status(400).json({ message: "Missing fromBlock or toBlock" });
  }

  try {
    const logs = await alchemy.core.getLogs({
      address: '0xd525ab689dD6ffF5615327657A6C1A230Dd09188',
      fromBlock: `0x${parseInt(fromBlock, 10).toString(16)}`,
      toBlock: `0x${parseInt(toBlock, 10).toString(16)}`,
    });

    const decodedLogs = logs.map(log => {
      const hex = log.data;
      const decoded = Buffer.from(hex.replace(/^0x/, ''), 'hex').toString('utf8');
      return {
        cid: decoded,
        timestamp: parseInt(log.blockNumber, 16),
      };
    });

    return res.json({ success: true, logs: decodedLogs });
  } catch (err) {
    console.error('Error fetching all logs:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch all logs' });
  }
};

viewRoutes.get('/all/logs', handleGetLogs);
viewRoutes.get('/:cid', handleGetFile);



export default viewRoutes;
