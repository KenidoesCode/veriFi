"use client";
import { useEffect, useRef } from "react";

export default function MatrixRain({ isAnchoring }: { isAnchoring?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const letters = "01アイウエオカキクケコｱｲｳｴｵ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      // Background fade (trails)
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix letters
      ctx.fillStyle = isAnchoring ? "#00ffaa" : "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;

        drops[i] += isAnchoring ? 0.35 : 0.25; // Speed up slightly while anchoring
      }

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, [isAnchoring]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 bg-black"
      style={{
        filter: "brightness(0.9) contrast(1.2)",
        transition: "all 0.5s ease-in-out",
      }}
    />
  );
}
