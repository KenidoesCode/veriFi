const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

/**
 * SHA-512 Hash to Hex — Works in both Node & Browser
 */
export async function sha512Hex(data: Uint8Array): Promise<string> {
  // Convert to standard ArrayBuffer (avoids SharedArrayBuffer issue)
  const arrayBuffer =
    data.buffer instanceof ArrayBuffer ? data.buffer.slice(0) : new Uint8Array(data).buffer;

  // Node environment (Render SSR, etc.)
  if (typeof window === "undefined") {
    const { createHash } = await import("crypto");
    const hash = createHash("sha512");
    hash.update(Buffer.from(arrayBuffer));
    return hash.digest("hex");
  }

  // Browser environment
  const hashBuffer = await crypto.subtle.digest("SHA-512", arrayBuffer as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Anchor proof on blockchain via backend
 */
export async function anchorOnChain(proof: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/anchor?proof=${proof}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("Anchor request failed:", err);
    throw new Error("Failed to reach backend. Ensure backend URL is correct.");
  }
}

/**
 * Verify proof existence on blockchain
 */
export async function verifyProof(proof: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/verify?proof=${proof}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("Verification request failed:", err);
    throw new Error("Failed to reach backend. Ensure backend URL is correct.");
  }
}
