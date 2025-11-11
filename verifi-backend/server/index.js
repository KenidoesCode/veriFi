import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ==================== JSON Import Fix (for Node 22) ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VeriFiABI = await import(path.join(__dirname, "../abi/VeriFi.json"), {
  with: { type: "json" },
}).then((m) => m.default);

// ==================== Express & CORS Setup ====================
const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://verifi-ai.netlify.app",
  "https://verifi-frontendd.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(`✅ CORS allowed for: ${origin || "Server"}`);
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// ==================== Blockchain Setup ====================
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("❌ Missing environment variables in .env file!");
  process.exit(1);
}

console.log("✅ Connecting to blockchain...");

// ✅ FIX for Ethers v6 — Proper Provider Initialization
const provider = new ethers.JsonRpcProvider
  ? new ethers.JsonRpcProvider(RPC_URL)
  : new ethers.providers.JsonRpcProvider(RPC_URL); // fallback (dual support)

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, VeriFiABI.abi, wallet);

// ==================== Routes ====================

// 🪶 Anchor Document
app.get("/anchor", async (req, res) => {
  try {
    const proof = req.query.proof;
    if (!proof) return res.status(400).json({ error: "Missing proof" });

    console.log("📥 Anchoring proof:", proof);
    const tx = await contract.anchorDocument(proof);
    await tx.wait();

    console.log(`✅ Anchored successfully | TX: ${tx.hash}`);
    res.json({ message: "Anchored successfully", txHash: tx.hash });
  } catch (err) {
    console.error("❌ Anchor failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Verify Document
app.get("/verify", async (req, res) => {
  try {
    const proof = req.query.proof;
    if (!proof) return res.status(400).json({ error: "Missing proof" });

    console.log("🔍 Verifying proof:", proof);
    const result = await contract.getDocument(proof);

    const response = {
      verified: result.timestamp > 0,
      author: result.author,
      timestamp: Number(result.timestamp),
      proof,
    };

    console.log("✅ Verification result:", response);
    res.json(response);
  } catch (err) {
    console.error("❌ Verify failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`✅ VeriFi backend running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
});
