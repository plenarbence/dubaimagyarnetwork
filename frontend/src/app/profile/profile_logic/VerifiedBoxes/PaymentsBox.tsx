"use client";

import { useRouter } from "next/navigation";

export default function PaymentsBox() {
  const router = useRouter();

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 pb-14 w-full max-w-md relative flex flex-col">
                    
      {/* CÍM */}
      <h2 className="text-2xl font-semibold text-center mb-4">Fizetések</h2>

      {/* GOMBOK – középre igazítva a maradék magasságban */}
      <div className="flex-1 flex flex-col gap-3 justify-center">

        <button
          onClick={() => router.push("/profile/upcoming-payments")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Közelgő fizetések
        </button>

        <button
          onClick={() => router.push("/profile/subscriptions")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Előfizetések kezelése
        </button>

        <button
          onClick={() => router.push("/profile/history")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:opacity-90 transition"
        >
          Fizetési előzmények
        </button>

      </div>
    </div>
  );
}
