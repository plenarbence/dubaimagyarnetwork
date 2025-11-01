"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ListingPreviewPage() {
  const { id } = useParams(); // URL-ből jön az ID
  const [listing, setListing] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("Hiba a hirdetés lekérésekor:", err);
      }
    };
    fetchListing();
  }, [id, API_URL]);

  if (!listing) return <p className="p-6 text-gray-500">Betöltés...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{listing.title}</h1>
    </div>
  );
}
