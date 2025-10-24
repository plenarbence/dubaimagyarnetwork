"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TextEditor({ title, contentKey }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/content/${contentKey}`)
      .then((res) => res.json())
      .then((data) => setText(data.value || ""));
  }, [API_URL, contentKey]);

  const saveContent = async () => {
    setStatus("Saving...");
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API_URL}/content/${contentKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value: text }),
    });

    if (res.ok) {
      setStatus("✅ Saved successfully");
    } else if (res.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    } else {
      setStatus("❌ Error saving");
    }

  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* fejléc + visszagomb */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          ← Vissza a Dashboardra
        </button>
      </div>

      {/* textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-96 border rounded-lg p-3 font-mono"
      />

      {/* mentés gomb + státusz */}
      <div className="mt-4 flex gap-2 items-center">
        <button
          onClick={saveContent}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </div>
  );
}
