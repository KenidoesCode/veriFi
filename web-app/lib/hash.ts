// lib/hash.ts
/**
 * Cross-platform SHA-512 hex generator
 * Works in both Node (Render) and Browser
 */
export async function sha512Hex(buffer: Uint8Array): Promise<string> {
  // Normalize the input to a standard ArrayBuffer
  const arrayBuffer =
    buffer.buffer instanceof ArrayBuffer ? buffer.buffer.slice(0) : new Uint8Array(buffer).buffer;

  // Server-side (Render/Node)
  if (typeof window === "undefined") {
    const { createHash } = await import("crypto");
    const hash = createHash("sha512");
    hash.update(Buffer.from(arrayBuffer));
    return hash.digest("hex");
  }

  // Browser-side (client)
  const hashBuffer = await crypto.subtle.digest("SHA-512", arrayBuffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
