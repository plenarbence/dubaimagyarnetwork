"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CategorySEO = {
  id: number;
  name: string;
  slug: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_h1?: string | null;
  seo_intro?: string | null;
};

export default function CategorySEOPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState<CategorySEO[]>([]);
  const [selected, setSelected] = useState<CategorySEO | null>(null);

  const [form, setForm] = useState({
    slug: "",
    seo_title: "",
    seo_description: "",
    seo_h1: "",
    seo_intro: "",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===============================
  // FETCH CATEGORIES
  // ===============================
  const fetchCategories = async (keepSelectedId?: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/admin/categories/main/seo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data: CategorySEO[] = await res.json();
        setCategories(data);

        if (keepSelectedId) {
          const updated = data.find(c => c.id === keepSelectedId);
          if (updated) {
            setSelected(updated);
            setForm({
              slug: updated.slug ?? "",
              seo_title: updated.seo_title ?? "",
              seo_description: updated.seo_description ?? "",
              seo_h1: updated.seo_h1 ?? "",
              seo_intro: updated.seo_intro ?? "",
            });
            setIsDirty(false);
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch categories SEO", e);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===============================
  // SELECT CATEGORY
  // ===============================
  const selectCategory = (cat: CategorySEO) => {
    setSelected(cat);
    setForm({
      slug: cat.slug ?? "",
      seo_title: cat.seo_title ?? "",
      seo_description: cat.seo_description ?? "",
      seo_h1: cat.seo_h1 ?? "",
      seo_intro: cat.seo_intro ?? "",
    });
    setIsDirty(false);
    setError(null);
  };

  // ===============================
  // SAVE
  // ===============================
  const saveSEO = async () => {
    if (!selected) return;

    setIsSaving(true);
    setError(null);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/admin/categories/${selected.id}/seo`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.push("/login");
        return;
      }

      if (res.status === 409) {
        setError("Slug already exists.");
        return;
      }

      if (!res.ok) {
        setError("Failed to save SEO data.");
        return;
      }

      // ✅ SUCCESS → REFETCH FROM DB
      await fetchCategories(selected.id);
    } catch (e) {
      console.error("Save failed", e);
      setError("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
        <h1 className="text-xl font-semibold">Category SEO</h1>
        <Link href="/dashboard" className="text-zinc-400 hover:text-white">
          ← Back to dashboard
        </Link>
      </header>

      <div className="flex flex-1 w-full">
        {/* LEFT */}
        <aside className="w-1/4 border-r border-zinc-700 p-6">
          <ul className="space-y-2 text-zinc-300">
            {categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => selectCategory(cat)}
                className={`
                  cursor-pointer hover:text-white
                  ${selected?.id === cat.id ? "text-white font-medium" : ""}
                `}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT */}
        <main className="flex-1 p-6">
          {!selected && (
            <div className="text-zinc-400">
              Select a category to edit its SEO settings.
            </div>
          )}

          {selected && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-lg font-semibold text-white">
                {selected.name}
              </h2>

              {error && (
                <div className="text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setForm({ ...form, slug: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">SEO Title</label>
                <input
                  value={form.seo_title}
                  onChange={(e) => {
                    setForm({ ...form, seo_title: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">SEO Description</label>
                <textarea
                  rows={3}
                  value={form.seo_description}
                  onChange={(e) => {
                    setForm({ ...form, seo_description: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">SEO H1</label>
                <input
                  value={form.seo_h1}
                  onChange={(e) => {
                    setForm({ ...form, seo_h1: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">SEO Intro</label>
                <textarea
                  rows={6}
                  value={form.seo_intro}
                  onChange={(e) => {
                    setForm({ ...form, seo_intro: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={saveSEO}
                  disabled={!isDirty || isSaving}
                  className={`
                    px-4 py-2 rounded
                    ${!isDirty || isSaving
                      ? "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                      : "bg-white text-black hover:bg-zinc-200"}
                  `}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
