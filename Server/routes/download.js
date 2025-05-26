import express from 'express';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import FileAccess from '../routes/FileAccess.js';
import mime from 'mime-types';

const router = express.Router();

function decryptBuffer(encryptedBuffer, key) {
  const encryptedBase64 = encryptedBuffer.toString('base64');
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);
  const decryptedWords = decrypted;
  const decryptedBuffer = Buffer.from(decryptedWords.toString(CryptoJS.enc.Hex), 'hex');
  return decryptedBuffer;
}

router.get('/download/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const metadata = await FileAccess.findOne({ cid });
    if (!metadata) return res.status(404).json({ error: 'File not found in DB' });

    const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${cid}`;
    const response = await axios.get(ipfsUrl, { responseType: 'arraybuffer' });
    let fileBuffer = Buffer.from(response.data);

    if (metadata.isEncrypted) {
      fileBuffer = decryptBuffer(fileBuffer, metadata.decryptionKey);
    }

    const contentType = mime.lookup(metadata.originalName || '') || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${metadata.originalName || 'file'}"`);

    return res.send(fileBuffer);

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
