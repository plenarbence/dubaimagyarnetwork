"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, verifyEmail } from "@/lib/api";
import UserListingButton from "@/components/UserListingButton";


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // Például majd ide jöhet az API hívás, ami lekéri a hirdetések számát
  const [counts, setCounts] = useState({
    active: 0,
    pending_admin: 0,
    pending_user: 0,
    expired: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getCurrentUser(token);
        setUser(data);
      } catch (err) {
        setError("Érvénytelen vagy lejárt token. Jelentkezz be újra.");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const token = localStorage.getItem("token");
      await verifyEmail(token);
      const updatedUser = await getCurrentUser(token);
      setUser(updatedUser);
      alert("✅ E-mail sikeresen verifikálva!");
    } catch (err) {
      alert("❌ Hiba történt az e-mail verifikálása közben.");
    } finally {
      setVerifying(false);
    }
  };

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

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* ---------- PROFIL BLOKK ---------- */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Profil</h1>
        <p className="text-gray-700 mb-2">E-mail:</p>
        <p className="font-medium text-lg mb-6">{user.email}</p>

        {user.is_verified ? (
          <>
            <p className="text-green-600 font-medium mb-6">
              ✅ E-mail címed verifikálva
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:opacity-90 transition"
            >
              Kijelentkezés
            </button>
          </>
        ) : (
          <>
            <p className="text-yellow-600 font-medium mb-4">
              ⚠️ E-mail címed még nincs verifikálva
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="bg-gray-700 text-white py-2 px-4 rounded hover:opacity-90 transition disabled:opacity-60"
              >
                {verifying ? "Verifikálás..." : "E-mail verifikálása"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-700 text-white py-2 px-4 rounded hover:opacity-90 transition"
              >
                Kijelentkezés
              </button>
            </div>
          </>
        )}
      </div>

      {/* ---------- HIRDETÉSEIM BLOKK ---------- */}
      {user.is_verified && (
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Hirdetéseim
          </h2>

          <div className="flex flex-col gap-3">
            {/* Új hirdetés gomb marad */}
            <button
              onClick={() => router.push("/profile/create_listing")}
              className="bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
            >
              Új hirdetés feltöltése
            </button>

            {/* Dinamikus státusz gombok */}
            <UserListingButton
              status="active"
              label="Aktív hirdetések"
              path="active"
            />

            <UserListingButton
              status="pending_admin"
              label="Admin jóváhagyásra vár"
              path="pending_admin"
            />

            <UserListingButton
              status={["awaiting_payment", "rejected"]}
              label="Felhasználói jóváhagyásra vár"
              path="pending_user"
              highlight
            />


            <UserListingButton
              status="expired"
              label="Lejárt hirdetések"
              path="expired"
            />
          </div>
        </div>
      )}

    </div>
  );
}
