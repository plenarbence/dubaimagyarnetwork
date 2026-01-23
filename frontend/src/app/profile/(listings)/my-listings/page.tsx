"use client";

import { useEffect, useState } from "react";
import MyListingCard from "./components/MyListingCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type MyListing = {
  id: number;
  title: string;
  status: string;
  tags?: string[];
  rating_avg?: number | null;
  rating_count: number;
  main_image_id?: number | null;
};

const STATUS_GROUPS = [
  { key: "awaiting_payment", title: "Fizetésre vár" },
  { key: "pending_admin", title: "Admin jóváhagyásra vár" },
  { key: "rejected", title: "Admin által visszadobva" },
  { key: "draft", title: "Vázlatok" },
  { key: "active", title: "Aktív hirdetések" },
  { key: "expired", title: "Törölt hirdetések" },
];

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/listings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }

      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div className="p-6">Betöltés…</div>;
  }

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Hirdetéseim</h1>

      {listings.length === 0 && (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg font-medium text-gray-700">
            Még nincs hirdetésed
          </p>
          <p className="mt-2 text-sm">
            Hozz létre egy hirdetést, hogy megjelenj a platformon.
          </p>
        </div>
      )}

      {listings.length > 0 && STATUS_GROUPS.map((group) => {
        const groupListings = listings.filter(
          (l) => l.status === group.key
        );

        if (groupListings.length === 0) return null;

        return (
          <section key={group.key}>
            <h2 className="text-xl font-medium mb-4">
              {group.title}
            </h2>

            <div className="
              grid
              gap-6
              max-w-5xl
              mx-auto
              grid-cols-[repeat(auto-fit,20rem)]
              
            ">
              {groupListings.map((listing) => (
                <MyListingCard key={listing.id} listing={listing} />
              ))}
            </div>

          </section>
        );
      })}
    </div>
  );
}
