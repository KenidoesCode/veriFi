#!/bin/bash
echo "---------------------------------------------"
echo "🚀 VeriFi Auto Deployment + Server Startup"
echo "---------------------------------------------"

# Exit on first error
set -e

# 1️⃣ Install dependencies (show output this time)
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 2️⃣ Compile contracts
echo "🧠 Compiling smart contracts..."
npx hardhat compile

# 3️⃣ Deploy contract
echo "🪄 Deploying VeriFi contract..."
npx hardhat run scripts/deploy.js --network hardhat

# 4️⃣ Start backend server
echo "🌐 Starting verification backend..."
node server/index.js
