"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Nem sikerült lekérni a felhasználókat.");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>Betöltés...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      {/* 🔙 Vissza link */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-300 hover:text-white font-medium underline"
        >
          🔙 Back to Dashboard
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">👥 Felhasználók listája</h1>

      <div className="overflow-x-auto bg-neutral-900 shadow-lg rounded-lg border border-gray-700">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-neutral-800 text-gray-200 uppercase">
            <tr>
              <th className="py-3 px-4 border-b border-gray-700 text-left">Email</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">Verifikált</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">Regisztráció</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">Utolsó bejelentkezés</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 px-4 text-center text-gray-400"
                >
                  Nincsenek felhasználók az adatbázisban.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-800 hover:bg-neutral-800 transition"
                >
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">
                    {u.is_verified ? "✅" : "❌"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(u.created_at).toLocaleString("hu-HU")}
                  </td>
                  <td className="py-2 px-4">
                    {u.last_login
                      ? new Date(u.last_login).toLocaleString("hu-HU")
                      : "–"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
