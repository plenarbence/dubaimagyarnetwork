"use client";

import { useEffect, useState, useCallback } from "react";

export default function PendingUserListingsPage() {
  const [awaiting, setAwaiting] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --------------------------
  // ✅ Hirdetések lekérése
  // --------------------------
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
      if (!res.ok)
        throw new Error(data.detail || "Hiba történt a lekérés során.");

      setAwaiting(data.filter((l) => l.status === "awaiting_payment"));
      setRejected(data.filter((l) => l.status === "rejected"));
    } catch (err) {
      setError(err.message || "Ismeretlen hiba.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // --------------------------
  // ✅ Állapotfrissítő segédfüggvény (új endpoint)
  // --------------------------
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/listings/my/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_status: newStatus }),
      });

      if (!res.ok) throw new Error("Nem sikerült frissíteni a hirdetést.");

      await fetchListings();
    } catch (err) {
      alert(err.message || "Hiba történt a frissítés során.");
    }
  };

  // --------------------------
  // ✅ Render
  // --------------------------
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Felhasználói beavatkozást igénylő hirdetések
      </h1>

      {/* ========== Awaiting Payment ========== */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">
          💳 Fizetésre váró hirdetések
        </h2>

        {awaiting.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nincs fizetésre váró hirdetésed.
          </p>
        ) : (
          <ul className="space-y-4">
            {awaiting.map((listing) => (
              <li
                key={listing.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {listing.title}
                </h3>
                <p className="text-gray-600 mt-2">{listing.description}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Jóváhagyva:{" "}
                  {listing.approved_at
                    ? new Date(listing.approved_at).toLocaleDateString("hu-HU")
                    : "—"}
                </p>
                <button
                  onClick={() => updateStatus(listing.id, "active")}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Fizetve (aktiválás)
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ========== Rejected ========== */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-700">
          ❌ Visszadobott hirdetések
        </h2>

        {rejected.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nincs visszadobott hirdetésed.
          </p>
        ) : (
          <ul className="space-y-4">
            {rejected.map((listing) => (
              <li
                key={listing.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {listing.title}
                </h3>
                <p className="text-gray-600 mt-2">{listing.description}</p>
                {listing.admin_comment && (
                  <p className="text-sm text-red-500 mt-2 italic">
                    Admin megjegyzés: {listing.admin_comment}
                  </p>
                )}
                <button
                  onClick={() => updateStatus(listing.id, "pending_admin")}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Újraküldés admin jóváhagyásra
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
