"use client";

import { useRouter } from "next/navigation";

import { useAuthUser } from "../../profile_logic/useAuthUser";
import { useCreateListingStates } from "../listings_logic/useCreateListingStates";

import TitleInput from "../listings_logic/TitleInput";
import TagManager from "../listings_logic/TagManager";
import ContactFieldsManager from "../listings_logic/ContactFieldsManager";
import DescriptionInput from "../listings_logic/DescriptionInput";
import CategorySelector from "../listings_logic/CategorySelector";


export default function CreateListingPage() {
  const router = useRouter();

  // 🔥 1) User ellenőrzés — ha nincs token, redirect /login
  const { user, loading } = useAuthUser();

  // 🔥 2) Form state-ek behúzása
  const {title, setTitle,
    tags, setTags,
    description, setDescription,
    contact, setContact,
    category, setCategory,
  } = useCreateListingStates();

  // Amíg tölt a token ellenőrzés → ne villogjon az oldal
  if (loading) return <p className="p-6">Betöltés...</p>;

  if (!user) {
    return null;
  }


async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Be kell jelentkezned a mentéshez.");
      return;
    }

    // 🔑 category → category_id leképzés
    const category_id = category.childId
      ? Number(category.childId)
      : category.parentId
      ? Number(category.parentId)
      : null;

    const body = {
      title,
      description,
      tags: tags.length ? tags : null,

      company: contact.company || null,
      email: contact.email || null,
      phone_number: contact.phone || null,
      website: contact.website || null,
      whatsapp: contact.whatsapp || null,
      instagram: contact.instagram || null,
      tiktok: contact.tiktok || null,
      facebook: contact.facebook || null,
      youtube: contact.youtube || null,
      location: contact.location || null,

      category_id,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data?.detail || "Nem sikerült menteni a hirdetést.");
      return;
    }

    // ✅ siker → edit oldal
    router.push(`/profile/my-listings/edit/${data.id}`);
  } catch (err) {
    console.error("Create listing error:", err);
    alert("Hálózati hiba. Próbáld újra később.");
  }
}



  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Új hirdetés létrehozása</h1>

      <form onSubmit={handleSubmit} onKeyDown={(e) => {if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault(); }} className="flex flex-col gap-4">
      
        {/* ---- TITLE ---- */}
        <TitleInput value={title} onChange={setTitle} />

        {/* ---- TAGS ---- */}
        <TagManager tags={tags} onChange={setTags} />

        {/* ---- KONTAKT MEZŐK ---- */}
        <ContactFieldsManager value={contact} onChange={setContact} />

        {/* ---- HOSSZU LEIRAS ---- */}
        <DescriptionInput value={description} onChange={setDescription} />

        {/* ---- CATEGORY SELECTOR ---- */}
        <CategorySelector value={category} onChange={setCategory} />

        {/* ---- INFO ---- */}
        <p className="text-sm text-gray-600 italic mt-1">
          * Kép hozzáadása a mentés után válik lehetővé.
        </p>

        <button
          type="submit"
          className="bg-gray-800 text-white py-2 rounded hover:opacity-90 transition mt-2"
        >
          Mentés vázlatként
        </button>



      </form>
    </div>
  );
}

