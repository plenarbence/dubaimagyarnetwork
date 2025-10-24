"use client";

import { useEffect, useState } from "react";

export default function ProvidersPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch(`${API_URL}/content/providers`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setContent(data.value || "");
        } else {
          setContent("⚠️ A Providers tartalom jelenleg nem elérhető.");
        }
      } catch {
        setContent("⚠️ Hiba történt a tartalom betöltése közben.");
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="w-full p-6 prose prose-lg">
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
