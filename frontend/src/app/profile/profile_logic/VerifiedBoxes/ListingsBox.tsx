"use client";

import { useRouter } from "next/navigation";

export default function ListingsBox() {
  const router = useRouter();

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 pb-14 w-full max-w-md relative flex flex-col">
        
      {/* CÍM */}
      <h2 className="text-2xl font-semibold text-center mb-4">Hirdetések kezelése</h2>

      {/* GOMBOK */}
      <div className="flex-1 flex flex-col gap-3 justify-center">

        <button
          onClick={() => router.push("/profile/new")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Új hirdetés létrehozása
        </button>

        <button
          onClick={() => router.push("/profile/my-listings")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Saját hirdetéseim
        </button>

      </div>

    </div>
  );
}
