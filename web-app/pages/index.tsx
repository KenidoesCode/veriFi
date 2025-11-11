"use client";
import { useState } from "react";
import { sha512Hex, anchorOnChain } from "../lib/anchor";
import MatrixRain from "../components/MatrixRain";
import BootIntro from "../components/BootIntro";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Awaiting input...");
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  const handleFileUpload = async (selected: File) => {
    setFile(selected);
    setStatus("📂 File selected. Ready to anchor.");
  };

  const handleAnchor = async () => {
    if (!file) return alert("Please choose a file first.");
    setIsAnchoring(true);
    setStatus("🌐 Anchoring document on blockchain...");

    try {
      const buffer = await file.arrayBuffer();
      const hashHex = await sha512Hex(new Uint8Array(buffer));
      const result = await anchorOnChain(hashHex);

      if (result && result.txnHash) {
        setStatus(`✅ Anchored successfully! Txn: ${result.txnHash.slice(0, 10)}...`);
      } else {
        setStatus("⚠️ Backend responded, but no txn hash found.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Failed to anchor: ${err.message}`);
    } finally {
      setIsAnchoring(false);
    }
  };

  if (!bootComplete) return <BootIntro onFinish={() => setBootComplete(true)} />;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-green-400 font-mono">
      <MatrixRain isAnchoring={isAnchoring} />
      <div className="z-10 text-center animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-[0_0_5px_#00ff88]">
          Verify documents securely on the blockchain
        </h1>

        <p className="mb-6 text-lg">{status}</p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <span className="border border-green-400 bg-black/40 px-5 py-2 rounded hover:bg-green-900 hover:shadow-[0_0_8px_#00ff88] transition-all">
              Choose File
            </span>
          </label>

          <button
            onClick={handleAnchor}
            disabled={isAnchoring}
            className={`px-5 py-2 rounded border border-green-400 bg-black/40 transition-all ${
              isAnchoring
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-900 hover:shadow-[0_0_8px_#00ff88]"
            }`}
          >
            {isAnchoring ? "Processing..." : "Anchor on Blockchain"}
          </button>
        </div>

        <p className="mt-8 text-sm text-green-500 text-center">
          Secured by Polygon • Powered by VeriFi
        </p>
      </div>
    </div>
  );
}
