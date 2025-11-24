"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ------------------------------------------------
// ✅ REGISTER USER 
// ------------------------------------------------
export async function registerUser(email: string, password: string) {
  let res;

  try {
    res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    // 🔥 Fetch error → backend unreachable, DNS error, CORS, stb.
    throw new Error("A szerver nem elérhető. Próbáld meg később.");
  }

  // ❌ Backend responded, but with error status
  if (!res.ok) {
    let errMsg = `Registration failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.detail) errMsg = data.detail;
    } catch {
      const text = await res.text();
      if (text) errMsg = text;
    }

    throw new Error(errMsg);
  }

  // ✔ Siker
  return res.json();
}
