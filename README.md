<h1 align="center">Decentralized Data Storage and Access Control</h1>
<h3 align="center">Using Ethereum Smart Contracts & IPFS (Lighthouse)</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white" alt="Ethereum">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white" alt="IPFS">
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity">
</p>

## 📌 Overview

This project is a decentralized file storage web application where:

- **Files are stored off-chain on IPFS**
- **File metadata and ownership are stored on-chain using Ethereum smart contracts**
- **Users interact through a React frontend and MetaMask**

The goal is to avoid centralized storage providers while maintaining ownership, transparency, and integrity of stored files.

## 🧠 How the System Works (High Level)

1. User connects wallet using MetaMask
2. User uploads a file from the browser
3. File is uploaded and pinned to IPFS using Lighthouse
4. Lighthouse returns a CID (Content Identifier)
5. CID + metadata are stored in an Ethereum smart contract
6. Files can later be viewed or downloaded using the CID

> **Important:** Only metadata is stored on-chain. The actual file never goes on Ethereum.

## 🏗 Architecture

| Component | Technology |
|-----------|------------|
| Frontend | React.js |
| Blockchain | Ethereum (Sepolia testnet) |
| Smart Contracts | Solidity + Hardhat |
| Wallet | MetaMask |
| Storage | IPFS via Lighthouse |
| Blockchain Interaction | Ethers.js |

## 🔦 Why Lighthouse Is Used

Lighthouse is used as the IPFS pinning service:
- Uploads files to IPFS
- Keeps files pinned and accessible
- Returns a CID used by the smart contract

### ⚠️ Without Lighthouse:
- Uploads will fail
- No CID will be generated
- App will not work as expected

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js v18 or later
- Git
- MetaMask browser extension
- Sepolia testnet ETH (from a faucet)
- Lighthouse account & API key
- Alchemy or Infura RPC URL

## ⚙️ Installation & Setup

1️⃣ Clone Your Fork

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables
Create a .env file in the root directory.

PRIVATE_KEY=your_test_wallet_private_key
SEPOLIA_RPC_URL=your_rpc_url

4️⃣ Compile Smart Contracts
npx hardhat compile

5️⃣ Deploy Smart Contracts
npx hardhat run scripts/deploy.js --network sepolia
📌 Save the deployed contract address — you will need it for the frontend.


🖥 Frontend Setup
6️⃣ Configure Frontend .env

Inside the frontend directory (or root if shared):

REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
REACT_APP_LIGHTHOUSE_API_KEY=your_lighthouse_api_key
REACT_APP_SEPOLIA_RPC_URL=your_rpc_url

7️⃣ Run the App
npm start
App will run on: http://localhost:3000


----------------


🔐 Security & Privacy Notes (Very Important)
Files uploaded to IPFS are public by default
Anyone with the CID can access the file
Smart contract does not encrypt files
“Delete” only removes metadata, not the IPFS file

✅ Recommended: Encrypt files before uploading if storing sensitive data.


⚠️ Common Issues & Fixes
| Issue                              | Cause                      | Fix                      |
| ---------------------------------- | -------------------------- | ------------------------ |
| Upload fails                       | Missing Lighthouse API key | Check `.env` and restart |
| Deploy fails                       | No Sepolia ETH             | Fund wallet              |
| App shows no data                  | Wrong contract address     | Update frontend `.env`   |
| MetaMask error                     | Wrong network              | Switch to Sepolia        |
| File still accessible after delete | IPFS behavior              | Unpin manually           |
