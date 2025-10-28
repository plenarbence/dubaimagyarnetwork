"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function UserListingButton({
  status,
  label,
  path,
  highlight = false,
}) {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return;

      let filtered = [];

      if (Array.isArray(status)) {
        filtered = data.filter((l) => status.includes(l.status));
      } else {
        filtered = data.filter((l) => l.status === status);
      }

      setCount(filtered.length);
    } catch (err) {
      console.error("Count fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, status]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // 💡 külön hover szín attól függően, melyik a háttér
  const bgColor =
    highlight && count > 0
      ? "bg-red-600 hover:bg-red-700"
      : "bg-gray-700 hover:opacity-90";

  return (
    <button
      onClick={() => router.push(`/profile/${path}`)}
      className={`${bgColor} text-white py-2 rounded transition`}
    >
      {label} {loading ? "..." : `(${count})`}
    </button>
  );
}
