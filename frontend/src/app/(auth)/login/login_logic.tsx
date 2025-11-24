"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ------------------------------------------------
// ✅ LOGIN USER (OAuth2 form-data)
// ------------------------------------------------
export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  let res;

  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
    });
  } catch {
    throw new Error("A szerver nem elérhető. Próbáld meg később.");
  }

  if (!res.ok) {
    let errMsg = `Login failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.detail) errMsg = data.detail;
    } catch {
      const text = await res.text();
      if (text) errMsg = text;
    }

    throw new Error(errMsg);
  }

  return res.json();
}
