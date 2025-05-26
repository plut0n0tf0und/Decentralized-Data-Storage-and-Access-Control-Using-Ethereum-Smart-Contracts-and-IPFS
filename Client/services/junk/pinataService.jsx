import axios from 'axios';

const PINATA_API_KEY = '85676e080952b3d0e990';
const PINATA_SECRET_API = '3a69e5d6619f56855de73bcf5061380d9294daa26959fb58e7cd9282d8d308c3';

export const uploadFileToPinata = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API,
      },
    });
    return res.data.IpfsHash;
  } catch (err) {
    console.error('Upload failed', err);
    throw err;
  }
};
