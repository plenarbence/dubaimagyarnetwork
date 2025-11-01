"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ komponensek (már shared-ből)
import TitleInput from "@dubaimagyarnetwork/shared/components/create_listing/TitleInput";
import TagManager from "@dubaimagyarnetwork/shared/components/create_listing/TagManager";
import ContactFieldsManager from "@dubaimagyarnetwork/shared/components/create_listing/ContactFieldsManager";
import RichTextEditor from "@dubaimagyarnetwork/shared/components/create_listing/RichTextEditor";
import CategorySelector from "@dubaimagyarnetwork/shared/components/create_listing/CategorySelector";

export default function CreateListingPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ minimális state
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({
    company: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    youtube: "",
  });
  const [description, setDescription] = useState("");
  const [descCharCount, setDescCharCount] = useState(0);
  const [category, setCategory] = useState({ parentId: "", childId: "" });
  const [status, setStatus] = useState("");

  // ✅ vázlat mentése
  async function handleSaveDraft(e) {
    e.preventDefault();
    setStatus("Mentés folyamatban...");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setStatus("Be kell jelentkezned a hirdetés mentéséhez.");
        return;
      }

      const body = {
        title,
        description,
        tags: tags.length ? tags : null,
        company: form.company || null,
        phone_number: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        location: form.location || null,
        whatsapp: form.whatsapp || null,
        instagram: form.instagram || null,
        tiktok: form.tiktok || null,
        facebook: form.facebook || null,
        youtube: form.youtube || null,
        category_id: category.childId
          ? Number(category.childId)
          : category.parentId
          ? Number(category.parentId)
          : null,
      };

      const res = await fetch(`${API_URL}/listings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.detail || "Nem sikerült menteni a hirdetést.");
        return;
      }

      setStatus("✅ Vázlat sikeresen elmentve!");
      setTimeout(() => router.push("/profile/pending_user"), 1000);
    } catch {
      setStatus("❌ Hálózati hiba. Próbáld újra később.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Új hirdetés létrehozása</h1>

      <form onSubmit={handleSaveDraft} className="flex flex-col gap-4">
        {/* ---- CÍM ---- */}
        <TitleInput value={title} onChange={setTitle} />

        {/* ---- TAGEK ---- */}
        <TagManager tags={tags} onChange={setTags} />

        {/* ---- KONTAKT MEZŐK ---- */}
        <ContactFieldsManager form={form} onUpdate={setForm} />

        {/* ---- LEÍRÁS ---- */}
        <RichTextEditor
          maxLength={1000}
          onUpdate={(html, len) => {
            setDescription(html);
            setDescCharCount(len);
          }}
        />

        {/* ---- KATEGÓRIA ---- */}
        <CategorySelector onChange={setCategory} />

        {/* ---- INFO + GOMB ---- */}
        <p className="text-sm text-gray-600 italic mt-1">
          * Kép hozzáadása a mentés után válik lehetővé.
        </p>

        <button
          type="submit"
          disabled={descCharCount > 1000}
          className="bg-gray-800 text-white py-2 rounded hover:opacity-90 transition mt-2 disabled:opacity-60"
        >
          Mentés vázlatként
        </button>
      </form>

      {status && (
        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{status}</p>
      )}
    </div>
  );
}
