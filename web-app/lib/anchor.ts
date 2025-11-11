const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:4000";

export async function sha512Hex(data: Uint8Array) {
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function anchorOnChain(proof: string) {
  const url = `${BACKEND_URL}/anchor?proof=${proof}`;
  console.log("🌐 Fetching:", url);

  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);
    const data = await response.json();
    console.log("✅ Backend Response:", data);
    return data;
  } catch (err: any) {
    console.error("❌ Fetch Error:", err);
    throw new Error("Failed to fetch from backend. Check if server is running and CORS enabled.");
  }
}
