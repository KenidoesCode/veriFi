# 🔗 VeriFi – Blockchain Document Verification DApp

🚀 **VeriFi** is a decentralized application (DApp) that allows users to **anchor and verify document proofs on the blockchain**, ensuring authenticity, transparency, and tamper-proof validation — all powered by **Polygon Amoy Testnet**.

🌍 **Live Demo:** [https://verifi-keni-dapp.netlify.app](https://verifi-keni-dapp.netlify.app)  

---

## ✨ **Core Features**
✅ Upload any document and generate a unique **SHA-512 proof hash**  
✅ Instantly **anchor the proof on Polygon blockchain**  
✅ **Verify authenticity** — detect if a document has been anchored before  
✅ Fully decentralized, transparent, and censorship-resistant  
✅ Real-time status updates with elegant frontend animation  

---

## 🧠 **Tech Stack**
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS  
- **Blockchain:** Solidity + Hardhat + Polygon Amoy Testnet  
- **Backend:** Express.js + Ethers.js + Render (Node.js server)  
- **Hosting:**  
  - Frontend → Netlify  
  - Backend → Render  

---

## 🪄 Real-World Importance 

🧾 Why VeriFi Matters:

Prevents fake certificates, tampered documents, and fraudulent proofs.

Ideal for education, healthcare, legal, and government sectors.

Anyone can verify a document’s authenticity publicly — without needing a middleman.

💡 In real-world terms:

A university, hospital, or company could use VeriFi to publicly prove the authenticity of any digital file — forever.

🎓 What I Learned

🔹 How to connect Next.js frontend with a decentralized backend (Ethers.js + Hardhat)
🔹 How Solidity smart contracts interact with external APIs
🔹 Deploying full-stack blockchain DApps using Render + Netlify
🔹 Managing CORS, RPCs, and environment variables for production-grade deployment
🔹 Understanding blockchain immutability and on-chain data validation

🧩 Smart Contract – Core Functions
function anchorDocument(string memory proof) external
function getDocument(string memory proof) external view returns (address author, uint256 timestamp)
function isAnchored(string memory proof) external view returns (bool)


Each proof is permanently recorded on-chain with timestamp and author — ensuring absolute trust and transparency.

## 🔍 **Architecture Overview**

```text
+-------------------+        +---------------------+       +------------------+
|     Frontend      | <----> |   Backend (Render)  | <----> |  Polygon Blockchain |
| (Next.js + UI)    |        | (Express + Ethers)  |       | (Smart Contract)   |
+-------------------+        +---------------------+       +------------------+
        ↑                             ↑
        |                             |
   [User Uploads File]        [Stores Proof via anchorDocument()]
        ↓                             ↓
   [SHA-512 Proof Hash]        [Retrieves via getDocument()]



⚙️ Setup (Local Testing)
# Clone repository
git clone https://github.com/KenidoesCode/veriFi
cd veriFi

# Install dependencies
npm install

# Compile & Deploy Smart Contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygon_amoy

# Start backend
cd verifi-backend
node server/index.js

# Start frontend
cd web-app
npm run dev

🧠 Future Enhancements

🔐 Zero-Knowledge Proof (ZKP) based document validation

🧾 Multi-file verification with Merkle trees

🌐 DAO-based certificate issuance

📡 IPFS integration for decentralized document storage
