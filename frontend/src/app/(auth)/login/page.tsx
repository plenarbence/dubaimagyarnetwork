"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./login_logic";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Kérlek tölts ki minden mezőt.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 API hívás
      const res = await loginUser(email, password);

      // 🔹 Token tárolása
      if (res?.access_token) {
        localStorage.setItem("token", res.access_token);

        // 🔹 NavBar frissítése
        window.dispatchEvent(new Event("authChange"));

        // 🔹 Redirect profile
        router.push("/profile");
      } else {
        setError("Hibás e-mail vagy jelszó.");
      }

    } catch (err) {
      let msg = "Hiba történt a bejelentkezés során.";

      if (err instanceof Error) {
        msg = err.message;
      }

      setError(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center pt-20 pb-12 bg-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Bejelentkezés
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
            autoComplete="current-password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Bejelentkezés..." : "Belépés"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Nincs még fiókod?{" "}
          <a href="/register" className="text-black font-medium hover:underline">
            Regisztrálj itt
          </a>
        </p>

        <p className="text-sm text-center text-gray-500 mt-2">
          <a
            href="/forgot-password"
            className="text-black font-medium hover:underline"
          >
            Elfelejtetted a jelszavad?
          </a>
        </p>

      </div>
    </div>
  );
}
