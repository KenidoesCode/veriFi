import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// ✅ FIXED: Proper CORS setup for both localhost and Render deployments
app.use(
  cors({
    origin: [
      "http://127.0.0.1:3000", // for Next.js (Turbopack)
      "http://localhost:3000", // standard Next dev
      "https://verifi-frontend.onrender.com", // example Render/Vercel domain
      "https://verifi.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Validate env variables
if (!RPC_URL || !CONTRACT_ADDRESS || !PRIVATE_KEY) {
  console.error("❌ Missing environment variables in .env file!");
  process.exit(1);
}

// ✅ Load ABI dynamically
const ABI_PATH = path.resolve("./abi/VeriFi.json");
const ABI = JSON.parse(fs.readFileSync(ABI_PATH, "utf8")).abi;

// ✅ Initialize provider, wallet, and contract
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ VeriFi backend online. Connected to Polygon Amoy.");
});

// ✅ Anchor route
app.get("/anchor", async (req, res) => {
  try {
    const proof = req.query.proof;
    if (!proof) return res.status(400).json({ error: "Proof missing in query" });

    console.log(`📥 Anchoring proof: ${proof}`);
    const tx = await contract.anchor(proof);
    await tx.wait();

    res.json({
      success: true,
      txnHash: tx.hash,
      proof,
      message: "Anchored successfully on Polygon",
    });
  } catch (err) {
    console.error("❌ Anchor Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Verify route
app.get("/verify", async (req, res) => {
  try {
    const proof = req.query.proof;
    if (!proof) return res.status(400).json({ error: "Proof missing in query" });

    console.log(`🔍 Verifying proof: ${proof}`);
    const [author, timestamp] = await contract.getAnchor(proof);
    const verified = author !== ethers.constants.AddressZero;

    res.json({
      verified,
      author,
      timestamp: Number(timestamp),
      proof,
    });
  } catch (err) {
    console.error("❌ Verify Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start backend server
app.listen(PORT, () => {
  console.log(`✅ VeriFi backend running on port ${PORT}`);
  console.log(`🌐 CORS enabled for frontend at http://127.0.0.1:3000`);
});
