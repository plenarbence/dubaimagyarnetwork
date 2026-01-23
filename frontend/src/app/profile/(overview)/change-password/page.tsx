"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "./change_password_logic";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔹 client-side validáció
    if (newPassword !== confirm) {
      setError("Az új jelszavak nem egyeznek.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Az új jelszónak minimum 8 karakter hosszúnak kell lennie.");
      return;
    }

    try {
      setLoading(true);

      await changePassword(oldPassword, newPassword, confirm);

      // 🔹 success → vissza profilra
      router.push("/profile");

    } catch (err) {
      let msg = "Hiba történt a jelszó megváltoztatása során.";

      if (err instanceof Error) {
        msg = err.message;
      }

      setError(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-20 pb-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Jelszó megváltoztatása
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="password"
            placeholder="Jelenlegi jelszó"
            autoComplete="current-password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Új jelszó"
            autoComplete="new-password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Új jelszó megerősítése"
            autoComplete="new-password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-medium py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Mentés..." : "Jelszó megváltoztatása"}
          </button>

        </form>
      </div>
    </div>
  );
}
