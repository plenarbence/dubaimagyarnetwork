"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";


// ✅ komponensek (ugyanazok, mint a create oldalon)
import TitleInput from "@dubaimagyarnetwork/shared/components/create_listing/TitleInput";
import TagManager from "@dubaimagyarnetwork/shared/components/create_listing/TagManager";
import ContactFieldsManager from "@dubaimagyarnetwork/shared/components/create_listing/ContactFieldsManager";
import RichTextEditor from "@dubaimagyarnetwork/shared/components/create_listing/RichTextEditor";
import CategorySelector from "@dubaimagyarnetwork/shared/components/create_listing/CategorySelector";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ alap state-ek (ugyanazok mint create-nél)
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
  const [status, setStatus] = useState("Betöltés...");
  const [images, setImages] = useState([]);

// ✅ adatok betöltése a hirdetésből
useEffect(() => {
  if (!id) return;

  async function fetchListing() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Be kell jelentkezned a szerkesztéshez.");
        return;
      }

      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.detail || "Nem sikerült betölteni a hirdetést.");
        return;
      }

      // megkeressük a megfelelő listinget ID alapján
      const listing = data.find((l) => String(l.id) === String(id));
      if (!listing) {
        setStatus("Hirdetés nem található.");
        return;
      }

      // form feltöltése
      setTitle(listing.title || "");
      setTags(listing.tags || []);
      setForm({
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
      setDescription(listing.description || "");
      setDescCharCount(listing.description ? listing.description.length : 0);
      setCategory({
        parentId: listing.category?.parent_id
          ? String(listing.category.parent_id)
          : "",
        childId: listing.category_id ? String(listing.category_id) : "",
      });

      // ✅ képek lekérése a listinghez
      try {
        const imgRes = await fetch(`${API_URL}/images/${listing.id}`);
        if (imgRes.ok) {
          const imgs = await imgRes.json();
          setImages(imgs);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Képbetöltés hiba:", err);
        setImages([]);
      }

      setStatus(""); // sikeres betöltés után üres
    } catch {
      setStatus("❌ Hálózati hiba történt betöltéskor.");
    }
  }

  fetchListing();
}, [id, API_URL]);

  // ✅ mentés (PATCH /listings/my/{id})
  async function handleUpdate(e) {
    e.preventDefault();
    setStatus("Mentés folyamatban...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Be kell jelentkezned a mentéshez.");
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

      const res = await fetch(`${API_URL}/listings/my/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.detail || "Nem sikerült frissíteni a hirdetést.");
        return;
      }

      setStatus("✅ Hirdetés sikeresen frissítve!");
      setTimeout(() => router.push(`/profile/preview/${id}`), 1000);
    } catch {
      setStatus("❌ Hálózati hiba. Próbáld újra később.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Hirdetés szerkesztése</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        {/* ---- CÍM ---- */}
        <TitleInput value={title} onChange={setTitle} />

        {/* ---- TAGEK ---- */}
        <TagManager tags={tags} onChange={setTags} />

        {/* ---- KONTAKT MEZŐK ---- */}
        <ContactFieldsManager form={form} onUpdate={setForm} />

        {/* ---- LEÍRÁS ---- */}
        <RichTextEditor
          maxLength={1000}
          initialValue={description}
          onUpdate={(html, len) => {
            setDescription(html);
            setDescCharCount(len);
          }}
        />

        {/* ---- KATEGÓRIA ---- */}
        <CategorySelector value={category} onChange={setCategory} />


        {/* ---- KÉPEK LISTÁJA ---- */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Feltöltött képek</h2>

          {images.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Még nincs feltöltött kép ehhez a hirdetéshez.
            </p>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative border rounded overflow-hidden group"
                >
                  {/* 🔹 maga a kép */}
                  <Image
                    src={img.url}
                    alt={img.filename || "listing image"}
                    width={300}
                    height={400}
                    className="w-full aspect-[3/4] object-cover rounded"
                  />

                  {/* 🔹 ha ez a borítókép */}
                  {img.is_main && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                      Borítókép
                    </span>
                  )}

                  {/* 🟩 borítókép kiválasztó gomb (ha nem ez a fő kép) */}
                  {!img.is_main && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`${API_URL}/images/${img.id}/set_main`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });

                          if (res.ok) {
                            // 🔄 új képek lekérése a backendről, hogy a kijelölés azonnal látszódjon
                            const imgRes = await fetch(`${API_URL}/images/${id}`);
                            if (imgRes.ok) {
                              const imgs = await imgRes.json();
                              setImages(imgs);
                            }
                          } else {
                            console.error("Borítókép beállítási hiba:", await res.text());
                          }
                        } catch (err) {
                          console.error("Hálózati hiba borítókép beállításakor:", err);
                        }
                      }}
                      className="absolute top-1 left-1 w-4 h-4 border border-black shadow-sm rounded-sm bg-white/80 hover:bg-green-500 hover:border-green-600 transition"
                      title="Beállítás borítóképként"
                    ></button>
                  )}

                  {/* 🔴 törlés gomb */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm("Biztosan törlöd ezt a képet?")) return;

                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`${API_URL}/images/${img.id}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });

                        if (res.ok) {
                          // új képek lekérése a backendről
                          const imgRes = await fetch(`${API_URL}/images/${id}`);
                          if (imgRes.ok) {
                            const imgs = await imgRes.json();
                            setImages(imgs);
                          }
                        } else {
                          console.error("Törlési hiba:", await res.text());
                        }
                      } catch (err) {
                        console.error("Hálózati hiba törlés közben:", err);
                      }
                    }}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100"
                    title="Kép törlése"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>




        {/* ---- KÉPFELTÖLTÉS ---- */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Új képek feltöltése</h2>

          {/* Magyar gomb a fájl kiválasztásához */}
          <label
            htmlFor="file-upload"
            className="inline-block bg-gray-800 text-white text-sm px-4 py-2 rounded cursor-pointer hover:opacity-90 transition"
          >
            Képek kiválasztása
          </label>

          {/* Rejtett file input */}
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files.length) return;

              const token = localStorage.getItem("token");
              if (!token) {
                setStatus("Be kell jelentkezned a képfeltöltéshez.");
                return;
              }

              setStatus("📤 Képek feltöltése folyamatban...");

              // minden fájlt egyenként feltöltünk
              for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("listing_id", id);

                try {
                  const res = await fetch(`${API_URL}/images/`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                  });

                  // 🔹 Hibakezelés (emberi szöveggel)
                  if (!res.ok) {
                    let errorMsg = `HTTP ${res.status}`;
                    try {
                      const data = await res.json();

                      if (Array.isArray(data)) {
                        // FastAPI validation hiba → több elemű lista
                        errorMsg = data
                          .map((d) => d.msg || JSON.stringify(d))
                          .join(", ");
                      } else if (data && typeof data === "object") {
                        errorMsg = data.detail || JSON.stringify(data);
                      }
                    } catch (jsonErr) {
                      console.warn("Nem JSON válasz:", jsonErr);
                    }

                    // 🔸 Hibát jelenítünk meg a felhasználónak
                    setStatus(`❌ Feltöltési hiba: ${errorMsg}`);
                    alert(`❌ Feltöltési hiba: ${errorMsg}`);
                    break; // ne próbálja feltölteni a maradék fájlokat
                  }
                } catch (err) {
                  console.error("Feltöltési hiba:", err);
                  setStatus("❌ Hálózati hiba történt a feltöltés közben.");
                  alert("❌ Hálózati hiba történt a feltöltés közben.");
                  break;
                }
              }

              // ✅ sikeres feltöltés után frissítjük a képek listáját
              try {
                const imgRes = await fetch(`${API_URL}/images/${id}`);
                if (imgRes.ok) {
                  const imgs = await imgRes.json();
                  setImages(imgs);
                }
              } catch (err) {
                console.error("Képfrissítés hiba:", err);
              }

              setStatus("✅ Képfeltöltés befejezve.");
              e.target.value = ""; // input kiürítése
            }}
          />
        </div>



        {/* ---- GOMB ---- */}
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
