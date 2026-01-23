"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ListingItem = {
  id: number;
  title: string;
  is_featured: boolean;
};

export default function FeaturedListingsPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [view, setView] = useState<"featured" | "not_featured">("featured");
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isSaving, setIsSaving] = useState<number | null>(null);

  // ===============================
  // FETCH LISTINGS
  // ===============================
  const fetchListings = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/listings-featured`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data: ListingItem[] = await res.json();
        setListings(data);
      }
    } catch (e) {
      console.error("Failed to fetch featured listings", e);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===============================
  // TOGGLE FEATURED
  // ===============================
  const toggleFeatured = async (listing: ListingItem) => {
    setIsSaving(listing.id);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/admin/listings/${listing.id}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(!listing.is_featured),
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.push("/login");
        return;
      }

      if (res.ok) {
        await fetchListings();
      }
    } catch (e) {
      console.error("Failed to update featured listing", e);
    } finally {
      setIsSaving(null);
    }
  };

  const featured = listings.filter((l) => l.is_featured);
  const notFeatured = listings.filter((l) => !l.is_featured);
  const activeList = view === "featured" ? featured : notFeatured;

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
        <h1 className="text-xl font-semibold">Featured Listings</h1>

        <Link href="/dashboard" className="text-zinc-400 hover:text-white">
          ← Back to dashboard
        </Link>
      </header>

      <div className="flex flex-1 w-full">
        {/* LEFT – SELECTOR */}
        <aside className="w-1/4 border-r border-zinc-700 p-6">
          <ul className="space-y-2 text-zinc-300">
            <li
              onClick={() => setView("featured")}
              className={`
                cursor-pointer hover:text-white
                ${view === "featured" ? "text-white font-medium" : ""}
              `}
            >
              Featured listings
            </li>

            <li
              onClick={() => setView("not_featured")}
              className={`
                cursor-pointer hover:text-white
                ${view === "not_featured" ? "text-white font-medium" : ""}
              `}
            >
              Not featured listings
            </li>
          </ul>
        </aside>

        {/* RIGHT – LIST */}
        <main className="flex-1 p-6">
          <div className="space-y-2 text-zinc-300">
            {activeList.map((l) => (
              <div
                key={l.id}
                onClick={() => toggleFeatured(l)}
                className={`
                  flex items-center justify-between
                  border border-zinc-700 rounded
                  px-4 py-2
                  hover:bg-zinc-800
                  cursor-pointer
                  ${isSaving === l.id ? "opacity-60 pointer-events-none" : ""}
                `}
              >
                <span>{l.title}</span>

                {view === "featured" && (
                  <span className="text-green-400">✓</span>
                )}
              </div>
            ))}

            {activeList.length === 0 && (
              <div className="text-zinc-400">
                {view === "featured"
                  ? "No featured listings."
                  : "No non-featured listings."}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
