"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      // már be van jelentkezve → dashboard
      router.push("/dashboard");
    } else {
      // nincs token → login oldal
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-500">Betöltés...</p>
    </div>
  );
}
