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
    <div className="matrix-bg min-h-screen flex flex-col items-center justify-center text-green-400 font-mono relative">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center drop-shadow-[0_0_5px_#00ff88]">
        Verify Document
      </h1>

      <input
        type="text"
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        placeholder="Enter proof hash..."
        className="w-full max-w-md bg-black/50 border border-green-400 rounded-lg p-3 mb-4 text-center text-green-400 placeholder-green-700 outline-none focus:shadow-[0_0_8px_#00ff88]"
      />

      <button
        onClick={handleVerify}
        className="px-6 py-2 border border-green-400 bg-black/40 rounded hover:bg-green-900 hover:shadow-[0_0_8px_#00ff88] transition-all"
      >
        Verify Proof
      </button>

      <p className="mt-6 text-green-400 text-center z-10">{status}</p>

      <p className="mt-8 text-sm text-green-500 text-center z-10">
        Secured by Polygon • Powered by VeriFi
      </p>
    </div>
  );
}
