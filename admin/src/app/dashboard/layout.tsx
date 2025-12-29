"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        setLoading(false);
      } catch {
        localStorage.removeItem("admin_token");
        router.push("/login");
      }
    };

    verify();
  }, [router, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-400">
        Checking admin session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      {children}
    </div>
  );
}
