"use client";

import { useEffect, useState, useCallback } from "react";

export default function AdminPendingListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --------------------------------------------------------
  // ✅ Pending hirdetések lekérése (memoizált függvény)
  // --------------------------------------------------------
  const fetchPendingListings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setStatus("❌ Nincs admin token – jelentkezz be újra.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/listings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.detail || "Nem sikerült lekérni a hirdetéseket."}`);
        setLoading(false);
        return;
      }

      // csak az admin review alatt lévőket mutatjuk
      const pending = data.filter((l) => l.status === "pending_admin");
      setListings(pending);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]); // csak akkor frissül, ha az API_URL megváltozik

  // --------------------------------------------------------
  // ✅ Komponens betöltéskor hívjuk meg
  // --------------------------------------------------------
  useEffect(() => {
    fetchPendingListings();
  }, [fetchPendingListings]);

  // --------------------------------------------------------
  // ✅ Admin döntés (jóváhagyás / elutasítás)
  // --------------------------------------------------------
  const handleDecision = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`❌ ${data.detail || "Hiba történt a művelet során."}`);
        return;
      }

      alert(
        newStatus === "awaiting_payment"
          ? "✅ Hirdetés jóváhagyva és fizetésre vár."
          : "🚫 Hirdetés visszautasítva."
      );

      fetchPendingListings(); // újratöltjük a listát
    } catch (err) {
      console.error(err);
      alert("❌ Hálózati hiba.");
    }
  };

  // --------------------------------------------------------
  // ✅ JSX
  // --------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Admin jóváhagyásra váró hirdetések
      </h1>

      {loading ? (
        <p>Betöltés...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-600">Nincs admin jóváhagyásra váró hirdetés.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow rounded-xl p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {listing.title}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                {listing.description}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Beküldve:{" "}
                {new Date(listing.created_at).toLocaleString("hu-HU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleDecision(listing.id, "awaiting_payment")}
                  className="bg-gray-700 text-white py-1 px-4 rounded hover:opacity-90 transition"
                >
                  ✅ Jóváhagyás
                </button>
                <button
                  onClick={() => handleDecision(listing.id, "rejected")}
                  className="bg-gray-700 text-white py-1 px-4 rounded hover:opacity-90 transition"
                >
                  ❌ Elutasítás
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {status && (
        <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">{status}</p>
      )}
    </div>
  );
}
