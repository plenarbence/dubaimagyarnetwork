"use client";

import { useState, useEffect } from "react";

export default function SuggestionBox() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error();
      }

      setSuccess(true);
      setText("");
    } catch {
      setError("Hiba történt az üzenet elküldése közben.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (!success) return;

    const t = setTimeout(() => setSuccess(false), 2000);
    return () => clearTimeout(t);
    }, [success]);


  return (
    <div className="mt-12  pt-8">
      <h2 className="text-xl font-semibold mb-3">
        Van javaslatod vagy észrevételed?
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={4}
        className="w-full border rounded p-3 text-sm"
        placeholder="Írd le nyugodtan, amit szeretnél..."
      />

      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Küldés
        </button>

        {success && (
          <span className="text-gray-600 text-sm">
            Köszönjük a visszajelzést!
          </span>
        )}

        {error && (
          <span className="text-red-600 text-sm">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
