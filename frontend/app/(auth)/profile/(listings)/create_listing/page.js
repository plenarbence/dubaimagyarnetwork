"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("🔄 Hirdetés küldése folyamatban...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("❌ Be kell jelentkezned a hirdetés beküldéséhez.");
        return;
      }

      const res = await fetch(`${API_URL}/listings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.detail || "Nem sikerült beküldeni a hirdetést."}`);
        return;
      }

      setStatus("✅ A hirdetéskérelem sikeresen beküldve, admin jóváhagyásra vár!");

      // kis várakozás, majd visszairányítás a profilra
      setTimeout(() => {
        router.push("/profile");
      }, 1500);

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Hálózati hiba. Próbáld újra később.");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Új hirdetés beküldése</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Hirdetés címe"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Rövid leírás"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded min-h-[120px]"
          required
        />

        <button
          type="submit"
          className="bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Hirdetéskérelem beküldése
        </button>
      </form>

      {status && (
        <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{status}</p>
      )}
    </div>
  );
}
