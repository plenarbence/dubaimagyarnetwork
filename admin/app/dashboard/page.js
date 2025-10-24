"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/login");
    } else {
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

        <p className="text-gray-600 mb-8">
          Üdv, admin! Innen tudod kezelni a felhasználókat, tartalmakat és más beállításokat. 📊
        </p>

        {/* --- ÚJ RÉSZ: szerkeszthető oldalak --- */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-2">Szerkeszthető tartalmak</h2>

          <button
            onClick={() => router.push("/dashboard/terms")}
            className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-medium">Terms & Conditions</span>
            <p className="text-sm text-gray-500">Oldal tartalmának szerkesztése</p>
          </button>

          <button
            onClick={() => router.push("/dashboard/privacy")}
            className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-medium">Privacy Policy</span>
            <p className="text-sm text-gray-500">Oldal tartalmának szerkesztése</p>
          </button>

          <button
            onClick={() => router.push("/dashboard/providers")}
            className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-medium">Providers</span>
            <p className="text-sm text-gray-500">Oldal tartalmának szerkesztése</p>
          </button>

          <button
            onClick={() => router.push("/dashboard/contact")}
            className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-medium">Contact</span>
            <p className="text-sm text-gray-500">Oldal tartalmának szerkesztése</p>
          </button>

          <button
            onClick={() => router.push("/dashboard/categories")}
            className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-medium">Categories</span>
            <p className="text-sm text-gray-500">Struktura tartalmának szerkesztése</p>
          </button>

          <button
            onClick={() => router.push("/dashboard/users")}
            className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-medium">Users</span>
            <p className="text-sm text-gray-500">Users list</p>
          </button>
        </div>

        {/* --- korábbi placeholder --- */}
        <div className="mt-8 p-4 border border-gray-200 rounded bg-gray-50">
          <p className="text-gray-500">(Hamarosan ide jön a felhasználó-listázó modul.)</p>
        </div>
      </div>
    </div>
  );
}
