"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import RatingStars from "./../RatingStars";




const API_URL = process.env.NEXT_PUBLIC_API_URL;

type MyRating = {
  rating_id: number;
  text: string | null;
  rating: number;
  created_at: string;
  listing_id: number;
  listing_title: string;
  listing_isactive: boolean;
};

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState<MyRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);



  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch(`${API_URL}/ratings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Nem sikerült lehívni az értékeléseket.");
        }

        const data = await res.json();
        setRatings(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ismeretlen hiba történt.");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [router, refreshKey]);

  const handleDelete = async (ratingId: number) => {
    const confirmed = window.confirm(
      "Biztosan törölni szeretnéd ezt az értékelést?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/ratings/${ratingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Nem sikerült törölni az értékelést.");
      return;
    }

    // 👉 trigger újrafetch
    setRefreshKey((k) => k + 1);
  };


  if (loading) {
    return <div className="p-6">Betöltés…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Értékeléseim</h1>

      {ratings.length === 0 && (
        <div className="text-gray-500">Még nincs értékelésed.</div>
      )}

      {ratings.map((r) => (
        <div
          key={r.rating_id}
          className="relative border rounded p-4 space-y-1"
        >

      {r.listing_isactive ? (
        <Link
          href={`/services/service/${r.listing_id}`}
          className="font-medium hover:underline cursor-pointer"
        >
          {r.listing_title}
        </Link>
      ) : (
        <span className="font-medium text-gray-400 cursor-not-allowed">
          {r.listing_title}
        </span>
      )}



          <RatingStars rating={r.rating} />

        <div className="text-xs text-gray-500">
          {new Date(r.created_at)
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", ".")}
        </div>


          {r.text && (
            <div className="text-sm">
              {r.text}
            </div>
          )}

        <button
          onClick={() => handleDelete(r.rating_id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          title="Értékelés törlése"
        >
          ✕
        </button>

        </div>
      ))}
    </div>
  );
}
