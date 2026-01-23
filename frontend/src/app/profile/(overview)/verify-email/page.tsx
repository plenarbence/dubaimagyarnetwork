"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  requestEmailVerificationCode,
  verifyEmailCode,
} from "./verify_logic";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0); // mp

  // 30 mp-es cooldown visszaszámláló
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequestCode = async () => {
    setError("");
    setInfo("");

    try {
      setLoading(true);
      await requestEmailVerificationCode();

      setInfo("Megerősítő kód elküldve az email címedre.");
      setCooldown(30);
    } catch {
      setError("Hiba történt a kód küldésekor.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!code || code.length !== 6) {
      setError("Add meg a 6 számjegyű kódot.");
      return;
    }

    try {
      setLoading(true);
      await verifyEmailCode(code);

      router.push("/profile");
    } catch {
      setError("Érvénytelen vagy lejárt kód.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-20 pb-12 bg-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Email megerősítése
        </h1>

        <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="6 jegyű kód"
            inputMode="numeric"
            pattern="[0-9]{6}"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black tracking-widest text-center"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {info && (
            <p className="text-gray-600 text-sm text-center">{info}</p>
          )}

          <button
            type="button"
            onClick={handleRequestCode}
            disabled={loading || cooldown > 0}
            className="border border-black text-black font-medium py-3 rounded-lg hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            {cooldown > 0
              ? `Kód újraküldése (${cooldown}s)`
              : "Megerősítő kód küldése"}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-medium py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Ellenőrzés..." : "Megerősítés"}
          </button>
        </form>
      </div>
    </div>
  );
}
