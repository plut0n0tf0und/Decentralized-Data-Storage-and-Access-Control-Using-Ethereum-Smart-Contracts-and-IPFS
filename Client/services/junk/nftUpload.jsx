import { NFTStorage, File } from 'nft.storage';

const API_KEY = 'bbc71060.e8404c47589d41dd96ae72227757eca7';
const client = new NFTStorage({ token: API_KEY });

export const uploadToNFTStorage = async (file) => {
  try {
    if (!(file instanceof Blob)) {
      throw new Error('The provided file must be a Blob instance.');
    }

    // Uploading the Blob to NFT.Storage
    const cid = await client.storeBlob(file);

    // Log CID and return it as a string
    console.log('Uploaded to NFT.Storage with CID:', cid);
    return cid?.toString() || cid;
  } catch (error) {
    // Log and return failure response
    console.error('Upload failed:', error);
    return { success: false, message: 'File upload failed', error: error.message };
  }
};
