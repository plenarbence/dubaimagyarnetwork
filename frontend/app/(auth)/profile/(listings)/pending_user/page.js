"use client";

import { useEffect, useState, useCallback } from "react";
import ListingCard from "@dubaimagyarnetwork/shared/components/ListingCard"; // ✅ shared import

export default function PendingUserListingsPage() {
  const [awaiting, setAwaiting] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchListings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Be kell jelentkezned a hirdetések megtekintéséhez.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Hiba történt a lekérés során.");

      setAwaiting(data.filter((l) => l.status === "awaiting_payment"));
      setRejected(data.filter((l) => l.status === "rejected"));
      setDrafts(data.filter((l) => l.status === "draft"));
    } catch (err) {
      setError(err.message || "Ismeretlen hiba.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Betöltés...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  // 🔹 Szekció renderelő
  const renderSection = (title, color, listings) => (
    <section className="mb-10">
      <h2 className={`text-xl font-semibold mb-4 ${color}`}>{title}</h2>
      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">Nincs ilyen státuszú hirdetésed.</p>
      ) : (
        <div className="flex flex-wrap gap-5 justify-center">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} linkTo={`/profile/preview/${l.id}`} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Felhasználói beavatkozást igénylő hirdetések
      </h1>

      {renderSection("💳 Fizetésre váró hirdetések", "text-yellow-700", awaiting)}
      {renderSection("❌ Visszadobott hirdetések", "text-red-700", rejected)}
      {renderSection("📝 Mentett vázlatok", "text-blue-700", drafts)}
    </div>
  );
}
