"use client";

import { useState } from "react";

type Rating = {
  id: number;
  user_id: number;
  created_at: string;
  rating: number;
  text: string | null;
};

type Props = {
  listingId: number;
  ratings: Rating[];
  userId: number | null;
  isLoggedIn: boolean;
  setReloadKey: React.Dispatch<React.SetStateAction<number>>;
};

export default function ListingRatings({
  listingId,
  ratings,
  userId,
  isLoggedIn,
  setReloadKey,
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const hasUserRated =
    isLoggedIn && userId !== null
      ? ratings.some(r => r.user_id === userId)
      : false;

  const [ratingValue, setRatingValue] = useState(1);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // SUBMIT RATING
  // -----------------------------
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/ratings/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listingId,
          rating: ratingValue,
          text: text || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.detail || "Nem sikerült menteni az értékelést.");
        return;
      }

      // frissítjük a listinget
      setText("");
      setRatingValue(5);
      setReloadKey(k => k + 1);

    } catch {
      setError("Hálózati hiba történt.");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="mt-8 pt-6 space-y-6">

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        Értékelések
      </h3>
      {/* ===== INPUT STATE ===== */}
      {!isLoggedIn && (
        <p className="text-sm text-gray-600">
          Jelentkezz be vagy regisztrálj értékelés írásához!
        </p>
      )}

      {isLoggedIn && hasUserRated && (
        <p className="text-sm text-gray-600">
          Köszönjük, hogy már értékelted ezt a szolgáltatást!
        </p>
      )}

      {isLoggedIn && !hasUserRated && (
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">
              Értékelés
            </label>
<div className="flex gap-1 mb-2">
  {[1, 2, 3, 4, 5].map(v => (
    <button
      key={v}
      type="button"
      onClick={() => setRatingValue(v)}
      className="relative w-6 h-6"
    >
      {/* keret */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d1d5db"
        strokeWidth="2"
        className="absolute inset-0"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>

      {/* kitöltés */}
      {ratingValue >= v && (
        <svg
          viewBox="0 0 24 24"
          fill="#6b7280"
          className="absolute inset-0"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )}
    </button>
  ))}
</div>

          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Szöveges értékelés (opcionális)
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={200}
              rows={3}
              className="w-full border rounded p-2"
              placeholder="Írd le a tapasztalatod…"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Mentés
          </button>
        </div>
      )}

      {/* ===== RATING LIST ===== */}
      <div className="space-y-4">
        {ratings.length === 0 && (
          <p className="text-sm text-gray-500">
            Ehhez a hirdetéshez még nincs értékelés.
          </p>
        )}

        {ratings.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-white">
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              {/* CSILLAGOK */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const filled = i < r.rating;

                  return (
                    <span key={i} className="relative w-4 h-4">
                      {/* keret */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d1d5db"
                        strokeWidth="2"
                        className="absolute inset-0"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>

                      {/* kitöltött */}
                      {filled && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="#6b7280"
                          className="absolute inset-0"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      )}
                    </span>
                  );
                })}
              </div>

              {/* DÁTUM */}
              <div className="text-xs text-gray-500">
                {new Date(r.created_at)
                  .toISOString()
                  .slice(0, 10)
                  .replaceAll("-", ".")}
              </div>
            </div>

            {/* SZÖVEG */}
            {r.text && (
              <p className="text-sm text-gray-700 mt-3 whitespace-pre-line">
                {r.text}
              </p>
            )}
          </div>

        ))}
      </div>
    </div>
  );
}
