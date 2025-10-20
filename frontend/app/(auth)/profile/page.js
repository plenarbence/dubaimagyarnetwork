"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getCurrentUser(token);
        setUser(data.current_user);
      } catch (err) {
        setError("Érvénytelen vagy lejárt token. Jelentkezz be újra.");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange")); // 🔥 frissíti a Navbar-t
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Betöltés...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Profil</h1>
        <p className="text-gray-700 mb-2">Bejelentkezett felhasználó:</p>
        <p className="font-medium text-lg">{user}</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("authChange")); // 🔥 azonnali Navbar frissítés
            router.push("/login");
          }}
          className="mt-6 bg-black text-white py-2 px-4 rounded hover:opacity-90 transition"
        >
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}
