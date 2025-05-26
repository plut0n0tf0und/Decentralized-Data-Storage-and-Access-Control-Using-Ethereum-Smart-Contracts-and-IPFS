const hre = require("hardhat");

async function main() {
  const DIDStorage = await hre.ethers.getContractFactory("DIDStorage");

  // 👇 Replace with your deployed address
  const contractAddress = "0xa8DD954495C9AbaE175d2838f03C5b12BC97aA09";
  const didStorage = await DIDStorage.attach(contractAddress);
  console.log("Logs:", logs);


  const cid = await didStorage.getDIDCID();
  console.log("📦 Stored CID:", cid);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
