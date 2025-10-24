"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/content/contact`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        try {
          setContent(JSON.parse(data.value));
        } catch {
          setContent(null);
        }
      }
      setLoading(false);
    }
    load();
  }, [API_URL]);

  if (loading) return <div className="text-center text-gray-500 p-12">Betöltés...</div>;
  if (!content) return <div className="text-center text-red-500 p-12">Hiba történt a tartalom betöltésekor.</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      <p className="mb-6 text-gray-700">{content.description}</p>

      <div className="space-y-4 text-lg">
        <p className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-current" />
          <a href={`mailto:${content.email}`} className="hover:underline text-gray-700">
            {content.email}
          </a>
        </p>

        <p className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-current" />
          <a href={`tel:${content.phone}`} className="hover:underline text-gray-700">
            {content.phone}
          </a>
        </p>

        <p className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-current" />
          <a
            href={`https://wa.me/${content.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-700"
          >
            WhatsApp üzenet
          </a>
        </p>
      </div>
    </div>
  );
}
