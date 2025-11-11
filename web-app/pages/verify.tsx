// pages/verify.tsx
"use client";
import { useState } from "react";
import { verifyProof } from "../lib/anchor";

export default function Verify() {
  const [proof, setProof] = useState("");
  const [status, setStatus] = useState("Awaiting verification...");

  const handleVerify = async () => {
    if (!proof.trim()) return alert("Enter a proof hash first.");
    setStatus("🔍 Verifying on blockchain...");

    try {
      const res = await verifyProof(proof);
      if (!res || res.timestamp === 0) {
        setStatus("❌ Not anchored / invalid proof");
      } else {
        setStatus(`✅ Verified! Timestamp: ${new Date(res.timestamp * 1000).toLocaleString()}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatus("⚠️ Failed to verify: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        Verify Document
      </h1>

      <input
        type="text"
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        placeholder="Enter proof hash..."
        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4 focus:border-emerald-500 outline-none text-center"
      />

      <button
        onClick={handleVerify}
        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg transition-all"
      >
        Verify Proof
      </button>

      <p className="mt-6 text-slate-300 text-center">{status}</p>
    </main>
  );
}
