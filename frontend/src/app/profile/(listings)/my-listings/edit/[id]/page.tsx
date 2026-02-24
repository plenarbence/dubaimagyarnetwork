"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import { useAuthUser } from "../../../../profile_logic/useAuthUser";
import { useState } from "react";

import TitleInput from "../../../listings_logic/TitleInput";
import TagManager from "../../../listings_logic/TagManager";
import ContactFieldsManager from "../../../listings_logic/ContactFieldsManager";
import DescriptionInput from "../../../listings_logic/DescriptionInput";
import CategorySelector from "../../../listings_logic/CategorySelector";

type ListingImage = {
  id: number;
  url: string;
  is_main: boolean;
};


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
  const [images, setImages] = useState<ListingImage[]>([]);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [uploading, setUploading] = useState(false);



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
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/images/listing/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setImageLoadError(true);
          return;
        }

        setImages(data);
        setImageLoadError(false);
      } catch (err) {
        console.error("Image preload error:", err);
        setImageLoadError(true);
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
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          )
            e.preventDefault();
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



        {/* ---- KÉPEK LISTÁJA ---- */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Feltöltött képek</h2>

          {imageLoadError ? (
            <p className="text-sm text-red-500 italic">
              A képek betöltése nem sikerült.
            </p>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Még nincs feltöltött kép ehhez a hirdetéshez.
            </p>
          ) : (
            <>
            <div className="grid grid-cols-5 gap-3">


              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative border rounded overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt="listing image"
                    width={300}
                    height={400}
                    className="w-full aspect-3/4 object-cover rounded"
                  />

                  {img.is_main && (
                    <span
                      className="absolute top-1 left-1 w-4 h-4 border border-green-600 shadow-sm rounded-sm bg-green-500"  
                      title="Ez a borítókép"
                    />
                  )}



                  {/* 🟩 borítókép kiválasztó gomb (ha nem ez a fő kép) */}
                  {!img.is_main && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          if (!token) return;

                          const res = await fetch(
                            `${API_URL}/images/${img.id}/set_main`,
                            {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          if (!res.ok) {
                            console.error(
                              "Borítókép beállítási hiba:",
                              await res.text()
                            );
                            return;
                          }

                          // 🔄 új képek lekérése (helyes endpoint)
                          const imgRes = await fetch(
                            `${API_URL}/images/listing/${id}`,
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );

                          if (imgRes.ok) {
                            const imgs = await imgRes.json();
                            setImages(imgs);
                          }
                        } catch (err) {
                          console.error(
                            "Hálózati hiba borítókép beállításakor:",
                            err
                          );
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
                        if (!token) return;

                        const res = await fetch(`${API_URL}/images/${img.id}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });

                        if (!res.ok) {
                          console.error("Törlési hiba:", await res.text());
                          return;
                        }

                        // 🔄 képek újralekérése (HELYES endpoint)
                        const imgRes = await fetch(`${API_URL}/images/listing/${id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });

                        if (imgRes.ok) {
                          const imgs = await imgRes.json();
                          setImages(imgs);
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

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-6">
                <span className="w-4 h-4 border border-green-600 shadow-sm rounded-sm bg-green-500" />
                <span>Borítókép</span>
              </div>
              </>
          )}
        </div>

        {uploading && (
          <p className="text-sm text-gray-500 italic mt-2">
            Feltöltés folyamatban…
          </p>
        )}


        {/* ---- KÉPFELTÖLTÉS ---- */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Új képek feltöltése</h2>

          <label
            htmlFor="file-upload"
            className="inline-block bg-gray-800 text-white text-sm px-4 py-2 rounded cursor-pointer hover:opacity-90 transition"
          >
            Képek kiválasztása
          </label>

          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || !files.length) return;

              const token = localStorage.getItem("token");
              if (!token) {
                alert("Be kell jelentkezned a képfeltöltéshez.");
                return;
              }

              setUploading(true);
              
              for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("listing_id", String(id));

                try {
                  const res = await fetch(`${API_URL}/images/`, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data?.detail || "Képfeltöltési hiba.");
                    break;
                  }

                  // ✅ új kép hozzáadása state-hez
                  setImages((prev) => [...prev, data]);

                } catch (err) {
                  console.error("Image upload error:", err);
                  alert("Hálózati hiba a képfeltöltésnél.");
                  break;
                } 
              }
              setUploading(false);
              e.target.value = ""; // input reset
            }}
          />
        </div>








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
            Elvetés
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
            Beküldés
          </button>

        </div>

      </form>
    </div>
  );
}
