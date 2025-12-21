"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { useAuthUser } from "../../../../profile_logic/useAuthUser";
import { useState } from "react";

import TitleInput from "../../../listings_logic/TitleInput";
import TagManager from "../../../listings_logic/TagManager";
import ContactFieldsManager from "../../../listings_logic/ContactFieldsManager";
import DescriptionInput from "../../../listings_logic/DescriptionInput";
import CategorySelector from "../../../listings_logic/CategorySelector";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔐 auth
  const { user, loading } = useAuthUser();

  // 🔥 state definition separately
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState({
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
  const [category, setCategory] = useState({
    parentId: "",
    childId: "",
  });


  // -----------------------------
  // ✅ PRELOAD LISTING
  // -----------------------------
  useEffect(() => {
    if (!id || !user) return;

    async function fetchListing() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const listing = await res.json();

        if (!res.ok) {
          alert(listing?.detail || "Nem sikerült betölteni a hirdetést.");
          return;
        }

        // 🧾 alapadatok
        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setTags(listing.tags || []);

        // 📞 kontakt
        setContact({
          company: listing.company || "",
          phone: listing.phone_number || "",
          email: listing.email || "",
          website: listing.website || "",
          location: listing.location || "",
          whatsapp: listing.whatsapp || "",
          instagram: listing.instagram || "",
          tiktok: listing.tiktok || "",
          facebook: listing.facebook || "",
          youtube: listing.youtube || "",
        });

        if (listing.category) {
          if (listing.category.parent_id) {
            // 🔹 alkategória volt mentve
            setCategory({
              parentId: String(listing.category.parent_id),
              childId: String(listing.category.id),
            });
          } else {
            // 🔹 csak főkategória volt mentve
            setCategory({
              parentId: String(listing.category.id),
              childId: "",
            });
          }
        }


      } catch (err) {
        console.error("Edit preload error:", err);
        alert("Hálózati hiba a betöltéskor.");
      }
    }

    fetchListing();
  }, [id, user, API_URL]);

  async function handleSave() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Be kell jelentkezned a mentéshez.");
        return;
      }

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

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.detail || "Mentés nem sikerült.");
        return;
      }

      alert("✅ Változtatások elmentve");
    } catch (err) {
      console.error("Save error:", err);
      alert("Hálózati hiba mentés közben.");
    }
  }

  async function handleSubmitForReview() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Be kell jelentkezned.");
        return;
      }

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
        `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}/submit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.detail || "Nem sikerült beküldeni a hirdetést.");
        return;
      }

      // ✅ siker → vissza a listára
      router.push("/profile/my-listings");
    } catch (err) {
      console.error("Submit listing error:", err);
      alert("Hálózati hiba. Próbáld újra később.");
    }
  }





  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading) return <p className="p-6">Betöltés...</p>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Hirdetés szerkesztése
      </h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="flex flex-col gap-4"
      >
        {/* ---- TITLE ---- */}
        <TitleInput value={title} onChange={setTitle} />

        {/* ---- TAGS ---- */}
        <TagManager tags={tags} onChange={setTags} />

        {/* ---- KONTAKT ---- */}
        <ContactFieldsManager value={contact} onChange={setContact} />

        {/* ---- LEÍRÁS ---- */}
        <DescriptionInput value={description} onChange={setDescription} />

        {/* ---- CATEGORY ---- */}
        <CategorySelector value={category} onChange={setCategory} />


        <p className="text-sm text-gray-600 italic mt-1">
          * Fontos: A hirdetés módosítása után az adminisztrátornak mindig jóvá kell hagynia a változtatásokat, mielőtt azok megjelennek az oldalon.
        </p>

        {/* gombok */}
        <div className="grid grid-cols-3 gap-3 pt-6">
          
          {/* ❌ ELVETÉS */}
          <button
            type="button"
            onClick={() => router.push("/profile/my-listings")}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Változtatások elvetése
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white hover:opacity-90"
          >
            Mentés
          </button>


          {/* 🚀 MENTÉS + BEKÜLDÉS*/}
          <button
            type="button"
            onClick={handleSubmitForReview}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white hover:opacity-90"
          >
            Mentés és beküldés
          </button>

        </div>

      </form>
    </div>
  );
}
