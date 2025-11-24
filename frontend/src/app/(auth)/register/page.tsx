"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "./register_logic";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔹 quick client-side validation
    if (password !== confirm) {
      setError("A jelszavak nem egyeznek.");
      return;
    }

    if (password.length < 8) {
      setError("A jelszónak minimum 8 karakter hosszúnak kell lennie.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 API call
      await registerUser(email, password);

      // 🔹 success → redirect
      router.push("/login");

    } catch (err) {
      // 🔹 err UNKNOWN típus → csak Error instance-ből lehet üzenetet kinyerni
      let errorMessage = "Hiba történt a regisztráció során.";

      if (err instanceof Error) {
        errorMessage = err.message; // register_logic.ts → throw new Error("...")
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-20 pb-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Regisztráció
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Jelszó"
            autoComplete="new-password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Jelszó megerősítése"
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
            {loading ? "Regisztrálás..." : "Regisztráció"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Már van fiókod?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            Jelentkezz be
          </a>
        </p>
      </div>
    </div>
  );
}
