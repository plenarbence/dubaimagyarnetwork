import { Mail, Phone, MessageCircle } from "lucide-react";

type ContactContent = {
  title: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
};

export default async function ContactPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  let content: ContactContent | null = null;
  let error = "";

  try {
    const res = await fetch(`${API_URL}/content/contact`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      try {
        content = JSON.parse(data.value) as ContactContent;
      } catch {
        error = "⚠️ A kontakt adatok hibás formátumúak.";
      }
    } else {
      error = "⚠️ A kontakt oldal jelenleg nem elérhető.";
    }
  } catch {
    error = "⚠️ Hiba történt a tartalom betöltése közben.";
  }

  if (error) {
    return (
      <div className="text-center text-gray-700 p-12">{error}</div>
    );
  }

  if (!content) {
    return (
      <div className="text-center text-gray-700 p-12">
        ⚠️ A kontakt adatok nem érhetők el.
      </div>
    );
  }

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
