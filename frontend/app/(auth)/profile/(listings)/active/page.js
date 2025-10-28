"use client";

import { useEffect, useState, useCallback } from "react";

export default function ActiveListingsPage() {
  const [listings, setListings] = useState([]);
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

      const filtered = data.filter((l) => l.status === "active");
      setListings(filtered);
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Aktív hirdetéseid
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-600">Jelenleg nincs aktív hirdetésed.</p>
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {listing.title}
              </h2>
              <p className="text-gray-600 mt-2">{listing.description}</p>
              <p className="text-sm text-gray-500 mt-3">
                Publikálva:{" "}
                {listing.published_at
                  ? new Date(listing.published_at).toLocaleDateString("hu-HU")
                  : "—"}
              </p>
              <p className="text-sm text-green-600 mt-1 font-medium">
                ✅ Aktív hirdetés
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
