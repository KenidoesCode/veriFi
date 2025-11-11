// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying VeriFi smart contract...");

  const VeriFi = await hre.ethers.getContractFactory("VeriFi");
  const verifi = await VeriFi.deploy();
  await verifi.deployed();

  console.log("✅ VeriFi deployed at:", verifi.address);

  const artifact = await hre.artifacts.readArtifact("VeriFi");
  const abiDir = path.join(__dirname, "..", "abi");
  if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir);
  fs.writeFileSync(
    path.join(abiDir, "VeriFi.json"),
    JSON.stringify({ address: verifi.address, abi: artifact.abi }, null, 2)
  );

  console.log("📦 ABI & address written to abi/VeriFi.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
