import mongoose from 'mongoose';

const allowedViewerSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  grantedAt: { type: Date,
     default: Date.now },
  name: { type: String, default: null }  // <--- added this
});


const fileAccessSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  cid: { type: String, required: true },
  decryptionKey: { type: String, default: "" },
  uploaderWallet: { type: String, required: true },
  isEncrypted: { type: Boolean, default: false },
  allowedViewers:  [allowedViewerSchema],
}, {
  timestamps: true,
});

fileAccessSchema.index({ uploaderWallet: 1, cid: 1, filename: 1 });

export default mongoose.model('FileAccess', fileAccessSchema);
