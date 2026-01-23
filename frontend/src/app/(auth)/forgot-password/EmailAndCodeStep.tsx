"use client";

import { useEffect, useState } from "react";
import {
  requestPasswordResetCode,
  checkPasswordResetCode,
} from "./check_logic";

type Props = {
  onCodeVerified: (email: string, code: string) => void;
};

export default function EmailAndCodeStep({ onCodeVerified }: Props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleRequestCode = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Add meg az email címed.");
      return;
    }

    try {
      setLoading(true);
      await requestPasswordResetCode(email);
      setInfo("Ha létezik fiók ezzel az email címmel, elküldtük a kódot.");
      setCooldown(30);
    } catch {
      setError("Hiba történt a kód küldésekor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCode = async () => {
    setError("");
    setInfo("");

    if (!code || code.length !== 6) {
      setError("Add meg a 6 számjegyű kódot.");
      return;
    }

    try {
      setLoading(true);
      await checkPasswordResetCode(email, code);
      onCodeVerified(email, code);
    } catch {
      setError("Érvénytelen vagy lejárt kód.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="6 jegyű kód"
        inputMode="numeric"
        pattern="[0-9]{6}"
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black tracking-widest text-center"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={loading}
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {info && <p className="text-gray-600 text-sm text-center">{info}</p>}

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
        type="button"
        onClick={handleCheckCode}
        disabled={loading}
        className="bg-black text-white font-medium py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Ellenőrzés..." : "Kód ellenőrzése"}
      </button>
    </div>
  );
}
