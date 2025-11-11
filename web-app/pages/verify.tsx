"use client";
import { useState } from "react";
import { verifyProof } from "../lib/anchor";
import MatrixRain from "../components/MatrixRain";
import BootIntro from "../components/BootIntro";

export default function Verify() {
  const [proof, setProof] = useState("");
  const [status, setStatus] = useState("Awaiting verification...");
  const [isVerifying, setIsVerifying] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  const handleVerify = async () => {
    if (!proof.trim()) return alert("Enter a proof hash first.");
    setIsVerifying(true);
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
    } finally {
      setIsVerifying(false);
    }
  };

  if (!bootComplete) return <BootIntro onFinish={() => setBootComplete(true)} />;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-green-400 font-mono">
      <MatrixRain isAnchoring={isVerifying} />
      <div className="z-10 text-center animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-[0_0_5px_#00ff88]">
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
          disabled={isVerifying}
          className={`px-6 py-2 border border-green-400 bg-black/40 rounded transition-all ${
            isVerifying
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-900 hover:shadow-[0_0_8px_#00ff88]"
          }`}
        >
          {isVerifying ? "Checking..." : "Verify Proof"}
        </button>

        <p className="mt-6 text-green-400 text-center">{status}</p>

        <p className="mt-8 text-sm text-green-500 text-center">
          Secured by Polygon • Powered by VeriFi
        </p>
      </div>
    </div>
  );
}
