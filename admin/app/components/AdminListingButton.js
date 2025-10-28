"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function AdminListingButton({ status, label, description, path, highlight = false }) {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/listings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return;

      const filtered = data.filter((l) => l.status === status);
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

  return (
    <button
      onClick={() => router.push(`/dashboard/${path}`)}
      className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
    >
      <span
        className={`text-lg font-medium ${
          highlight && count > 0 ? "text-red-600" : "text-gray-800"
        }`}
      >
        {label}
        {count > 0 && ` (${count})`}
      </span>
      <p className="text-sm text-gray-500">
        {loading ? "Betöltés..." : description}
      </p>
    </button>
  );
}
