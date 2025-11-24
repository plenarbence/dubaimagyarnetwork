"use client";

import { useRouter } from "next/navigation";
import type { UserResponse } from "./UserResponse";

export default function UnverifiedBox({ user }: { user: UserResponse }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 pb-14 w-full max-w-md relative">

      {/* Email */}
      <h2 className="text-2xl font-semibold text-center mb-4">Profil</h2>

      <p className="text-gray-700 text-center mb-1">E-mail cím:</p>
      <p className="text-center font-medium mb-6">{user.email}</p>

      {/* FIGYELEM ÜZENET */}
      <p className="text-yellow-600 font-medium text-center mb-6">
        ⚠️ E-mail címed még nincs megerősítve
      </p>

      {/* GOMBOK */}
      <div className="flex flex-col gap-3">

        <button
          onClick={() => router.push("/profile/resend-verification")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Megerősítő email újraküldése
        </button>

        <button
          onClick={() => router.push("/profile/change-password")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Jelszó megváltoztatása
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Kijelentkezés
        </button>

      </div>

      {/* Fiók törlése - jobb alsó sarok */}
      <button
        onClick={() => router.push("/profile/delete-profile")}
        className="absolute bottom-3 right-3 text-sm text-black underline"
      >
        Fiók törlése
      </button>
    </div>
  );
}
