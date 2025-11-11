// lib/hash.ts

/**
 * Cross-environment SHA-512 hashing — works in both browser and Node (Render)
 */
export async function sha512Hex(data: Uint8Array): Promise<string> {
  // Normalize input (force ArrayBuffer copy to avoid SharedArrayBuffer issues)
  const normalizedBuffer = new Uint8Array(data).buffer.slice(0);

  // If we're in Node.js (Render server-side build)
  if (typeof window === "undefined") {
    const { createHash } = await import("crypto");
    const hash = createHash("sha512");
    hash.update(Buffer.from(normalizedBuffer));
    return hash.digest("hex");
  }

  // Browser hashing (client)
  const hashBuffer = await crypto.subtle.digest("SHA-512", normalizedBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
