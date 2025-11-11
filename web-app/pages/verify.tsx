"use client";
import { useEffect, useState } from "react";
import { verifyProof } from "../lib/anchor";
import VeriFiAbi from "../abi/VeriFi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function Verify() {
  const [status, setStatus] = useState("Awaiting proof...");
  const [proof, setProof] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("proof");
    if (p) {
      setProof(p);
      handleVerify(p);
    }
  }, []);

  async function handleVerify(p: string) {
    setStatus("🔍 Verifying on blockchain...");
    try {
      const res = await verifyProof(CONTRACT_ADDRESS, VeriFiAbi, p);
      if (res.timestamp === 0) setStatus("❌ Not anchored / fake proof");
      else
        setStatus(
          `✅ Authentic\n\nAuthor: ${res.author}\nTimestamp: ${new Date(
            res.timestamp * 1000
          ).toLocaleString()}`
        );
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-matrixBlack text-matrixGreen relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/bg-matrix.gif')] bg-cover bg-center" />
      <section className="z-10 text-center p-6 rounded-2xl border border-matrixGreen shadow-[0_0_20px_#00FF88] backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-4 animate-pulse">
          Verify Proof
        </h1>
        <p className="text-xs break-words mb-4">{proof}</p>
        <pre className="text-xs whitespace-pre-line">{status}</pre>
      </section>
    </main>
  );
}
