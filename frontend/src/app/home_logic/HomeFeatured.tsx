"use client";

import { useEffect, useState } from "react";
import MyListingCard from "../services/components/MyListingCardPublic";
import Link from "next/link";



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

export default function HomeFeatured() {
  const [listings, setListings] = useState<PublicListingCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          `${API_URL}/listings/public/featured-cards`,
          { cache: "no-store" }
        );
        if (!res.ok) return;

        const data = await res.json();
        setListings(data);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading || listings.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold mb-4 px-4">
        Kiemelt hirdetések
      </h2>

      <div className="overflow-x-auto">
        <div className="flex gap-4 px-4 pb-2">
          {listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

        <div className="mt-3 px-4">
        <Link
            href="/services"
            className="text-xs text-gray-500 hover:text-gray-700 transition"
        >
            További hirdetések →
        </Link>
        </div>
    </section>
  );
}
