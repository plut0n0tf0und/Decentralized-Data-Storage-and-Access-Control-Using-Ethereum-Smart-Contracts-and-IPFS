require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/VFSUZT8LJcspLmr9Mur_15qU9RVEdJdo",
      accounts: ["8bda4ffd8f6a19b8e2111181015b0bf490ef667c854202e626ace7610a298b51"] // put wallet's private key here (NO QUOTES if using dotenv)
    },
  },
};
