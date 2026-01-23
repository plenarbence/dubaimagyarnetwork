const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res: Response) {
  if (!res.ok) {
    throw new Error("Hiba történt. Kérlek próbáld újra.");
  }
}

/**
 * 🔹 Jelszó visszaállítása auth kóddal
 * POST /auth-codes/reset-password-with-code
 * body: { email, code, new_password, new_password_confirm }
 */
export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string,
  newPasswordConfirm: string
) {
  const res = await fetch(
    `${API_URL}/auth-codes/reset-password-with-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      }),
    }
  );

  await handleResponse(res);
}
