// routes/onchain.js
import express from "express";
import { ethers } from "ethers";
import CIDStorage from '../Hardhat/artifacts/contracts/CIDStorage.sol/CIDStorage.json' assert { type: "json" };

const router = express.Router();
const contractAddress = "0xa8DD954495C9AbaE175d2838f03C5b12BC97aA09"; // <--- Replace with Sepolia address

router.get("/onchain-cids", async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/VFSUZT8LJcspLmr9Mur_15qU9RVEdJdo"); // or Alchemy
    const contract = new ethers.Contract(contractAddress, CIDStorage.abi, provider);
    const cids = await contract.getAllCIDs();

    res.status(200).json({ success: true, cids });
  } catch (err) {
    console.error("Failed to fetch on-chain CIDs", err);
    res.status(500).json({ success: false, message: "Failed to fetch CIDs" });
  }
});

export default router;
