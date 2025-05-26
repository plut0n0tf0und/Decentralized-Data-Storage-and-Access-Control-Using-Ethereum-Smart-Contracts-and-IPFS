import express from 'express';
import FileAccess from "../routes/FileAccess.js";
import { unknown } from 'io-ts';

const giveAccessRoutes = express.Router();

const handleFullAccess = async (req, res) => {
  const { uploaderWallet, viewerWallet, customName, cid } = req.body;

  if (!uploaderWallet || !viewerWallet) {
    return res.status(400).json({ message: "Missing wallet info" });
  }

  if (uploaderWallet.toLowerCase() === viewerWallet.toLowerCase()) {
    return res.status(400).json({ message: "🤨 Bruh, you can't give access to yourself." });
  }

  try {
    const filter = { uploaderWallet: uploaderWallet.toLowerCase() };
    if (cid) filter.cid = cid; // optional — allow giving access to one file only if cid passed

    const update = await FileAccess.updateMany(
      filter,
      {
        $addToSet: {
          allowedViewers: {
            wallet: viewerWallet.toLowerCase(),
            grantedAt: new Date(),
            name: customName || null,
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `✅ ${viewerWallet} now has access to ${update.modifiedCount} file(s).`,
    });
  } catch (err) {
    console.error("💥 Grant access error:", err);
    res.status(500).json({ success: false, message: "Server screwup 💀" });
  }
};


giveAccessRoutes.post("/give-access", handleFullAccess);

export default giveAccessRoutes;
