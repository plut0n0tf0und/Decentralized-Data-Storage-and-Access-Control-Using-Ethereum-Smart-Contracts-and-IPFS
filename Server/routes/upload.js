import express from 'express';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import FileAccess from '../routes/FileAccess.js'; // Adjust path if needed
import crypto from 'crypto';

const uploadRoutes = express.Router();
const API_KEY = '5f8.ba6';//lightHouse API key

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔐 Encrypt buffer helper
function encryptBuffer(buffer, key) {
  const iv = crypto.randomBytes(16);
  const hashedKey = crypto.createHash('sha256').update(String(key)).digest().slice(0, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

// 🛰️ Upload to Lighthouse
async function uploadToLighthouse(buffer, filename = 'file') {
  const form = new FormData();
  form.append('file', buffer, {
    filename,
    contentType: 'application/octet-stream',
  });

  const response = await axios.post(
    'https://node.lighthouse.storage/api/v0/add',
    form,
    {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );

  return response.data.Hash;
}

// 📤 Upload endpoint
uploadRoutes.post('/upload', upload.single('file'), async (req, res) => {
  const { uploaderWallet, isEncrypted } = req.body;
  const file = req.file;

  if (!file || !uploaderWallet) {
    return res.status(400).json({ success: false, message: 'Missing file or wallet' });
  }

  try {
    let cid;
    let secretKey = "";

    if (isEncrypted === 'true') {
      secretKey = crypto.randomBytes(32).toString('hex');
      const encryptedBuffer = encryptBuffer(file.buffer, secretKey);
      cid = await uploadToLighthouse(encryptedBuffer, file.originalname);

      // ⬇️ Only saving to DB if encrypted
      await FileAccess.create({
        cid,
        filename: file.originalname,
        uploaderWallet,           // uploaderWallet here only
        decryptionKey: secretKey,
        isEncrypted: true,
        allowedViewers: [],       // start empty, add viewers properly later
      });

    } else {
      cid = await uploadToLighthouse(file.buffer, file.originalname);
      // 👇 No DB write for unencrypted files
    }

     return res.json({
      success: true,
      cid,
      decryptionKey: secretKey,
      allowedViewers: [],
    });

  } catch (err) {
    console.error('💥 Upload error:', err);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
});

export default uploadRoutes;

