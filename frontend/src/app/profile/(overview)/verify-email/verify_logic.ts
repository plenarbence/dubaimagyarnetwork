const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res: Response) {
  if (!res.ok) {
    throw new Error("Hiba történt. Kérlek próbáld újra.");
  }
}

/**
 * 🔹 Email verifikációs kód igénylése
 * POST /auth-codes/request-email-verification
 * – email JWT-ből jön
 */
export async function requestEmailVerificationCode() {
  const res = await fetch(
    `${API_URL}/auth-codes/request-email-verification`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  await handleResponse(res);
}

/**
 * 🔹 Email verifikáció auth kóddal
 * POST /auth-codes/verify-email
 * – email JWT-ből jön
 * – body: { code }
 */
export async function verifyEmailCode(code: string) {
  const res = await fetch(`${API_URL}/auth-codes/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ code }),
  });

  await handleResponse(res);
}
