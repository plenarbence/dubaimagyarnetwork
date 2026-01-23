const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res: Response) {
  if (!res.ok) {
    throw new Error("Hiba történt. Kérlek próbáld újra.");
  }
}

/**
 * 🔹 Password reset kód igénylése
 * POST /auth-codes/request-password-reset
 * body: { email }
 */
export async function requestPasswordResetCode(email: string) {
  const res = await fetch(
    `${API_URL}/auth-codes/request-password-reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  await handleResponse(res);
}

/**
 * 🔹 Password reset kód ellenőrzése (read-only)
 * POST /auth-codes/check-password-reset-code
 * body: { email, code }
 */
export async function checkPasswordResetCode(
  email: string,
  code: string
) {
  const res = await fetch(
    `${API_URL}/auth-codes/check-password-reset-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    }
  );

  await handleResponse(res);
}
