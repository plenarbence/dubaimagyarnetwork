"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function changePassword(
  old_password: string,
  new_password: string,
  new_password_confirm: string
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Nincs bejelentkezve.");
  }

  let res;

  try {
    res = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password,
        new_password,
        new_password_confirm,
      }),
    });
  } catch {
    throw new Error("A szerver nem elérhető. Próbáld meg később.");
  }

  if (!res.ok) {
    let errMsg = `Password change failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.detail) errMsg = data.detail;
    } catch {
      const text = await res.text();
      if (text) errMsg = text;
    }

    throw new Error(errMsg);
  }

  return true;
}
