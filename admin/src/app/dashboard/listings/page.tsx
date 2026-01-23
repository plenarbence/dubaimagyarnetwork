"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function ListingsPage() {

  type AdminListingItem = {
    id: number;
    title: string;
    created_at: string;
    listing_clicks: number;
    social_clicks: number;
  };

  const router = useRouter();

  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [selectedState, setSelectedState] = useState<null | string>(null);
  const [listings, setListings] = useState<AdminListingItem[]>([]);


  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/admin/listings/counts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admin_token");
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch (err) {
        // network / fetch hiba → nem dobjuk ki az admint
        console.error("Failed to fetch admin listing counts", err);
      }
    };

    fetchCounts();
  }, [API_URL,router]);



  useEffect(() => {
    if (!selectedState) return;

    const fetchListings = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/admin/listings?state=${selectedState}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admin_token");
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setListings(data);
        }
      } catch (e) {
        console.error("Failed to fetch admin listings", e);
      }
    };

    fetchListings();
  }, [API_URL, router, selectedState]);









  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* TOP BAR – FULL WIDTH */}
      <header className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
        <h1 className="text-xl font-semibold">
          Listings
        </h1>

        <Link
          href="/dashboard"
          className="text-zinc-400 hover:text-white"
        >
          ← Back to dashboard
        </Link>
      </header>

      {/* CONTENT BELOW TOP BAR */}
      <div className="flex flex-1 w-full">
        {/* LEFT SIDE – STATE SELECTOR */}
        <aside className="w-1/4 border-r border-zinc-700 p-6">
          <ul className="space-y-2 text-zinc-300">
            <li className="hover:text-white cursor-pointer"
            onClick={() => setSelectedState("pending_admin")}
            >
              Pending approval{" "}
              {counts && `(${counts.pending_admin})`}
            </li>

            <li className="hover:text-white cursor-pointer"
            onClick={() => setSelectedState("awaiting_payment")}
            >
              Awaiting payment{" "}
              {counts && `(${counts.awaiting_payment})`}
            </li>

            <li className="hover:text-white cursor-pointer"
            onClick={() => setSelectedState("rejected")}
            >
              Rejected{" "}
              {counts && `(${counts.rejected})`}
            </li>

            <li className="hover:text-white cursor-pointer"
            onClick={() => setSelectedState("active")}
            >
              Active{" "}
              {counts && `(${counts.active})`}
            </li>

            <li className="hover:text-white cursor-pointer"
            onClick={() => setSelectedState("draft")}
            >
              Drafts{" "}
              {counts && `(${counts.draft})`}
            </li>

            <li className="hover:text-white cursor-pointer"
            onClick={() => setSelectedState("expired")}
            >
              Expired{" "}
              {counts && `(${counts.expired})`}
            </li>
          </ul>
        </aside>

        {/* RIGHT SIDE – WORK AREA */}
        <main className="flex-1 p-6">
          <div className="text-zinc-400 space-y-2">
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/dashboard/listings/${l.id}`}
                className="block border border-zinc-700 rounded px-4 py-2 hover:bg-zinc-800"
              >
                <div className="text-white font-medium">{l.title}</div>
                <div className="text-sm text-zinc-400">
                  {new Date(l.created_at).toLocaleString()}
                  {" · "}
                  {l.listing_clicks} clicks
                  {" · "}
                  {l.social_clicks} social
                </div>
              </Link>
            ))}

            {selectedState && listings.length === 0 && (
              <div>No listings in this state.</div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
