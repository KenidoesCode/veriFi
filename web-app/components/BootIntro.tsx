"use client";
import { useEffect, useState } from "react";

export default function BootIntro({ onFinish }: { onFinish: () => void }) {
  const messages = [
    "▶ VeriFi Terminal Initializing...",
    "▶ Establishing secure blockchain connection...",
    "▶ Connecting to Polygon Network...",
    "▶ Loading smart contract anchors...",
    "✅ System Ready. Welcome to VeriFi.",
  ];

  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setVisibleMessages((prev) => [...prev, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onFinish, 1000);
      }
    }, 1300);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black text-green-400 font-mono text-center">
      <div className="space-y-3">
        {visibleMessages.map((msg, i) => (
          <p
            key={i}
            className="animate-fadeIn drop-shadow-[0_0_6px_#00ff88]"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {msg}
          </p>
        ))}
      </div>
      <div className="mt-10 text-xs text-green-600 animate-pulse">
        Booting system...
      </div>
    </div>
  );
}
