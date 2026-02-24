"use client";

import { useEffect, useState } from "react";

type PublicStats = {
  users: number;
  listings: number;
  ratings: number;
  listing_clicks: number;
  contact_clicks: number;
};

export default function StatsSection() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/stats`
        );

        if (!res.ok) return;

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return null;
  if (!stats) return null;

  return (
    <section className="w-full pt-12 pb-2">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        <div>
          <div className="text-3xl font-semibold text-black">
            {stats.users.toLocaleString()}
          </div>
          <div className="text-sm text-black mt-1">
            Regisztrált felhasználó
          </div>
        </div>

        <div>
          <div className="text-3xl font-semibold text-black">
            {stats.listings.toLocaleString()}
          </div>
          <div className="text-sm text-black mt-1">
            Hirdetés
          </div>
        </div>

        {/*
        <div>
          <div className="text-3xl font-semibold text-black">
            {stats.ratings.toLocaleString()}
          </div>
          <div className="text-sm text-black mt-1">
            Értékelés
          </div>
        </div>
        */}

        <div>
          <div className="text-3xl font-semibold text-black">
            {stats.listing_clicks.toLocaleString()}
          </div>
          <div className="text-sm text-black mt-1">
            Hirdetés kattintás
          </div>
        </div>

        <div>
          <div className="text-3xl font-semibold text-black">
            {stats.contact_clicks.toLocaleString()}
          </div>
          <div className="text-sm text-black mt-1">
            Továbbkattintás
          </div>
        </div>

      </div>
    </section>
  );
}
