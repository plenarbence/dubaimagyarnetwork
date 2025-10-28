"use client";

import { useEffect, useState, useCallback } from "react";

export default function AwaitingPaymentListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchAwaitingPaymentListings = useCallback(async () => {
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

      const awaitingPayment = data.filter((l) => l.status === "awaiting_payment");
      setListings(awaitingPayment);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Hálózati hiba történt.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAwaitingPaymentListings();
  }, [fetchAwaitingPaymentListings]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Fizetésre váró hirdetések
      </h1>

      {loading ? (
        <p>Betöltés...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-600">Jelenleg nincs fizetésre váró hirdetés.</p>
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
              <p className="text-xs text-gray-500">
                Jóváhagyva:{" "}
                {listing.updated_at
                  ? new Date(listing.updated_at).toLocaleString("hu-HU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </p>
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
