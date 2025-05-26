import express from 'express';
import FileAccess from './FileAccess.js';

const router = express.Router();

// GET user history
router.get('/:wallet', async (req, res) => {
  const wallet = req.params.wallet?.toLowerCase();
  if (!wallet) return res.status(400).json({ success: false, message: "Missing wallet" });

  try {
    const files = await FileAccess.find({
      $or: [
        { uploaderWallet: wallet },
        { 'allowedViewers.wallet': wallet }
      ]
    }).sort({ createdAt: -1 });

    return res.json({ success: true, files });
  } catch (err) {
    console.error("💥 History fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE file by CID and wallet
// DELETE /api/history/:cid/:wallet
router.delete('/:cid/:wallet', async (req, res) => {
  const { cid, wallet } = req.params;
  console.log('🗑️ Delete request:', { cid, wallet });

  if (!cid || !wallet) {
    console.warn('❌ CID or wallet missing');
    return res.status(400).json({ success: false, message: "CID or wallet missing" });
  }

  try {
    const file = await FileAccess.findOneAndDelete({
      cid,
      uploaderWallet: wallet.toLowerCase()
    });

    if (!file) {
      console.warn('🕵️‍♂️ No match found for given CID + uploader');
      return res.status(404).json({ success: false, message: "File not found or not yours" });
    }

    console.log('✅ DB file deleted:', file.filename);
    return res.status(200).json({ success: true, message: "File deleted from DB" });
  } catch (err) {
    console.error("💥 DB delete error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});




export default router;
