"use client";

import { useEffect, useState } from "react";
import MyListingCardPublic from "./MyListingCardPublic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type PublicListingCard = {
  id: number;
  title: string;
  tags?: string[];
  rating_avg?: number | null;
  rating_count: number;
  main_image_url?: string | null;
  is_featured: boolean;
};

export default function ServicesClient() {
  const [listings, setListings] = useState<PublicListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"random" | "most_rated" | "best_rated">("random");

  const limit = 30;

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [seed, setSeed] = useState<number>(() => Math.random());





    useEffect(() => {
    const fetchListings = async () => {
        setLoading(true);

        try {
        const res = await fetch(
            `${API_URL}/listings/public/cards?sort=${sort}&seed=${seed}&limit=${limit}&offset=${offset}`
        );

        if (!res.ok) return;

        const data: PublicListingCard[] = await res.json();


        setListings((prev) => {
        if (offset === 0) {
            return data; // sort váltáskor tiszta lap
        }

        const map = new Map(prev.map((l) => [l.id, l]));
        data.forEach((l) => map.set(l.id, l));
        return Array.from(map.values());
        });


        if (data.length < limit) {
            setHasMore(false);
        }
        } finally {
        setLoading(false);
        }
    };

    fetchListings();
    }, [sort, offset, seed]);




  return (
    <div className="mx-auto max-w-6xl px-4 py-6">



        {/* SORT LINKS */}
        <div className="flex justify-end text-xs text-black mb-4">
        <button
            onClick={() => {setSeed(Math.random()); setSort("random"); setOffset(0); setHasMore(true);}}
            className={`px-1 hover:underline ${
            sort === "random" ? "underline font-medium" : ""
            }`}
        >
            Véletlenszerű
        </button>

        <span className="px-1 text-gray-400">|</span>

        <button
            onClick={() => {setSort("most_rated"); setOffset(0); setHasMore(true);}}
            className={`px-1 hover:underline ${
            sort === "most_rated" ? "underline font-medium" : ""
            }`}
        >
            Értékelések száma
        </button>

        <span className="px-1 text-gray-400">|</span>

        <button
            onClick={() => {setSort("best_rated"); setOffset(0); setHasMore(true);}}
            className={`px-1 hover:underline ${
            sort === "best_rated" ? "underline font-medium" : ""
            }`}
        >
            Csillagok száma
        </button>
        </div>

        <div className="
            grid
            gap-6
            max-w-5xl
            mx-auto
            grid-cols-[repeat(auto-fit,20rem)]
            
        ">
        {listings.map((listing) => (
            <MyListingCardPublic key={listing.id} listing={listing} />
        ))}
        </div>

        {hasMore && !loading && (
        <div className="mt-6 flex justify-center">
            <button
            onClick={() => setOffset((prev) => prev + limit)}
            className="text-sm text-black hover:underline"
            >
            További hirdetések betöltése
            </button>
        </div>
        )}


    </div>
  );
}
