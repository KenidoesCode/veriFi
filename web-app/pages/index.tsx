// pages/index.tsx
"use client";
import { useState } from "react";
import { sha512Hex, anchorOnChain } from "../lib/anchor";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Upload and anchor your document...");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (selected: File) => {
    setFile(selected);
    setStatus("📄 File selected, preparing hash...");
  };

  const handleAnchor = async () => {
    if (!file) return alert("Please choose a file first.");
    setIsLoading(true);
    setStatus("⚙️ Hashing file...");

    try {
      const buffer = await file.arrayBuffer();
      const hashHex = await sha512Hex(new Uint8Array(buffer));

      setStatus("🌐 Anchoring document on blockchain...");
      const result = await anchorOnChain(hashHex);

      if (result && result.txnHash) {
        setStatus(`✅ Anchored successfully! Tx: ${result.txnHash.substring(0, 16)}...`);
      } else {
        throw new Error("Unexpected backend response");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        VeriFi
      </h1>
      <p className="text-slate-300 mb-8">{status}</p>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <span className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-600 hover:border-emerald-400 hover:bg-slate-700 transition-all">
            Choose File
          </span>
        </label>

        <button
          onClick={handleAnchor}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isLoading ? "Processing..." : "Anchor on Blockchain"}
        </button>
      </div>

      <p className="mt-10 text-slate-500 text-sm">Secured by Polygon • Powered by VeriFi</p>
    </main>
  );
}
