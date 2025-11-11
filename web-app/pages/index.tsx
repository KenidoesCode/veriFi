"use client";
import { useState } from "react";
import MatrixRain from "../components/MatrixRain";
import { sha512Hex, anchorOnChain } from "../lib/anchor";

export default function Home() {
  const [status, setStatus] = useState("Awaiting input...");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setStatus("Hashing document...");
      const buffer = await file.arrayBuffer();
      const hash = await sha512Hex(new Uint8Array(buffer));

      setStatus("Anchoring on blockchain...");
      const result = await anchorOnChain(hash);

      if (result.success) {
        setStatus(`✅ Anchored successfully! Txn: ${result.txnHash}`);
      } else {
        setStatus("❌ Failed to anchor document.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ ${err.message || "Failed to fetch"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-green-400 font-mono overflow-hidden flex flex-col items-center justify-center">
      <MatrixRain />

      <div className="relative z-10 text-center border border-green-500/40 p-10 rounded-xl bg-black/70 shadow-[0_0_25px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)] transition-all backdrop-blur-sm">
        <h1 className="text-3xl mb-6 font-bold">Verify documents securely on the blockchain</h1>

        <p className="text-md mb-8 text-green-300">{status}</p>

        <div className="flex justify-center items-center gap-4 mb-6">
          {/* Choose File */}
          <label className="common-btn">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </label>

          {/* Anchor Button */}
          <button
            disabled={isLoading}
            className="common-btn disabled:opacity-50"
          >
            Anchor on Blockchain
          </button>
        </div>

        <p className="text-sm mt-8 text-green-600">
          Secured by Polygon • Powered by <span className="text-green-400 font-semibold">VeriFi</span>
        </p>
      </div>
    </main>
  );
}
