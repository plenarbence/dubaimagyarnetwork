"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // csak akkor fusson, amikor a böngészőben vagyunk
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/login");
    } else {
      // setState-et timeouton belül hívunk → nem triggerel cascade render warningot
      setTimeout(() => setAuthorized(true), 0);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Ellenőrzés...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Kijelentkezés
          </button>
        </div>

        <p className="text-gray-600">
          Üdv, admin! Innen fogod tudni kezelni a felhasználókat, tartalmakat
          és más beállításokat. 📊
        </p>

        <div className="mt-8 p-4 border border-gray-200 rounded bg-gray-50">
          <p className="text-gray-500">
            (Hamarosan ide jön a felhasználó-listázó modul.)
          </p>
        </div>
      </div>
    </div>
  );
}
