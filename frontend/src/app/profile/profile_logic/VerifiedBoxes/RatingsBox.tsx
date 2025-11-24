"use client";

import { useRouter } from "next/navigation";

export default function RatingsBox() {
  const router = useRouter();

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 pb-14 w-full max-w-md relative flex flex-col">
        
      {/* CÍM */}
      <h2 className="text-2xl font-semibold text-center mb-4">Értékelések kezelése</h2>

      {/* GOMBOK */}
      <div className="flex-1 flex flex-col gap-3 justify-center">

        <button
          onClick={() => router.push("/profile/own-ratings")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Hirdetéseimről írt értékelések
        </button>

        <button
          onClick={() => router.push("/profile/written-ratings")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Általam írt értékelések
        </button>

      </div>

    </div>
  );
}
