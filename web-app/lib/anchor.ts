const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

/**
 * Cross-compatible SHA-512 Hex Generator
 * Works in both browser and Node (Render)
 */
export async function sha512Hex(data: Uint8Array) {
  if (typeof window === "undefined") {
    // Node.js environment (like Render build)
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha512");
    hash.update(Buffer.from(data));
    return hash.digest("hex");
  } else {
    // Browser environment
    const hashBuffer = await crypto.subtle.digest("SHA-512", data.buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

/**
 * Anchor proof on blockchain through backend
 */
export async function anchorOnChain(proof: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/anchor?proof=${proof}`);
    if (!res.ok)
      throw new Error(`Backend error: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err: any) {
    console.error("Anchor request failed:", err);
    throw new Error("Failed to connect to backend.");
  }
}

/**
 * Verify proof existence on blockchain
 */
export async function verifyProof(proof: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/verify?proof=${proof}`);
    if (!res.ok)
      throw new Error(`Backend error: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err: any) {
    console.error("Verification request failed:", err);
    throw new Error("Failed to connect to backend.");
  }
}
