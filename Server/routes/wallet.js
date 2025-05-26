  import express from 'express';
import FileAccess from '../routes/FileAccess.js';
import { Alchemy, Network } from 'alchemy-sdk';
import axios from 'axios';
import crypto from 'crypto';
import mime from 'mime-types';

const router = express.Router();
 
router.post('/revoke', async (req, res) => {
  const { walletToRemove, requester } = req.body;

  if (!walletToRemove || !requester) {
    return res.status(400).json({ success: false, message: 'Missing walletToRemove or requester' });
  }

  try {
    // Update all files uploaded by requester, remove walletToRemove from allowedViewers
    const result = await FileAccess.updateMany(
      { uploaderWallet: requester.toLowerCase() },
      { $pull: { allowedViewers: { wallet: walletToRemove.toLowerCase() } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'No access found to revoke' });
    }

    res.json({ success: true, message: 'Access revoked from all files' });
  } catch (err) {
    console.error('❌ Revoke error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Get all files uploaded by this wallet (to show all allowedViewers)
router.get('/uploader-access/:wallet', async (req, res) => {
  const { wallet } = req.params;

  if (!wallet) {
    return res.status(400).json({ success: false, message: 'Missing wallet address' });
  }

  try {
    const files = await FileAccess.find({ uploaderWallet: wallet.toLowerCase() });

    // Normalize allowedViewers
    const cleanedFiles = files.map(file => {
      const normalizedViewers = file.allowedViewers.map(viewer => {
        if (typeof viewer === 'string') {
          return { wallet: viewer, grantedAt: null }; // 🧼 make it uniform
        }
        return viewer;
      });

      return {
        ...file.toObject(),
        allowedViewers: normalizedViewers,
      };
    });

    res.json({ success: true, files: cleanedFiles });
  } catch (err) {
    console.error('❌ Fetch uploader-access error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


export default router;
