"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type AdminListingDetail = {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  published_at: string | null;
  visibility_until: string | null;

  user_id: number; 
  user_email: string;

  main_category: string | null;
  sub_category: string | null;

  image_url_list: string[];

  company: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  whatsapp: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  youtube: string | null;
  location: string | null;
  tags: string[] | null;

  admin_comment: string | null;

  click_counter: number;
  click_counter_featured: number;
  click_website: number;
  click_email: number;
  click_phone: number;
  click_whatsapp: number;
  click_instagram: number;
  click_tiktok: number;
  click_facebook: number;
  click_youtube: number;
};

const LISTING_STATUSES = [
  "draft",
  "pending_admin",
  "awaiting_payment",
  "active",
  "expired",
  "rejected",
] as const;

export default function AdminListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [listing, setListing] = useState<AdminListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditingAdminComment, setIsEditingAdminComment] = useState(false);
  const [adminCommentDraft, setAdminCommentDraft] = useState("");
  const [isSavingAdminComment, setIsSavingAdminComment] = useState(false);

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string>("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<{
    parentId: string;
    childId: string;
  }>({ parentId: "", childId: "" });
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  type Category = {
    id: number;
    name: string;
    parent_id: number | null;
  };

  const [categories, setCategories] = useState<Category[]>([]);




  const fetchCategories = useCallback(async () => {

    try {
      const res = await fetch(`${API_URL}/categories/`);
      if (!res.ok) return;

      const data = await res.json();
      setCategories(data);
    } catch (err) {
    console.error("Failed to fetch categories", err);
  }
  }, [API_URL]);


  const fetchListing = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/admin/listings/${id}`,
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
        const data = await res.json();
        setListing(data);
      }
    } catch (e) {
      console.error("Failed to fetch admin listing detail", e);
    } finally {
      setLoading(false);
    }
  }, [API_URL, router, id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading…</div>;
  }

  if (!listing) {
    return <div className="p-6 text-zinc-400">Listing not found.</div>;
  }


  const startEditAdminComment = () => {
    setAdminCommentDraft(listing.admin_comment ?? "");
    setIsEditingAdminComment(true);
  };

  const cancelEditAdminComment = () => {
    setAdminCommentDraft(listing.admin_comment ?? "");
    setIsEditingAdminComment(false);
  };

  const saveAdminComment = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setIsSavingAdminComment(true);

    try {
      await fetch(
        `${API_URL}/admin/listings/${listing.id}/admin-comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminCommentDraft || null),
        }
      );

      await fetchListing();
      setIsEditingAdminComment(false);
    } finally {
      setIsSavingAdminComment(false);
    }
  };



  const startEditStatus = () => {
    setStatusDraft(listing.status);
    setIsEditingStatus(true);
  };

  const cancelEditStatus = () => {
    setStatusDraft(listing.status);
    setIsEditingStatus(false);
  };

  const saveStatus = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setIsSavingStatus(true);

    try {
      await fetch(
        `${API_URL}/admin/listings/${listing.id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statusDraft),
        }
      );

      await fetchListing(); // DB-truth
      setIsEditingStatus(false);
    } finally {
      setIsSavingStatus(false);
    }
  };




  const startEditCategory = () => {
    setCategoryDraft({
      parentId: listing.main_category ? "" : "",
      childId: listing.sub_category ? "" : "",
    });
    fetchCategories();
    setIsEditingCategory(true);
  };

  const cancelEditCategory = () => {
    setIsEditingCategory(false);
  };

  const saveCategory = async () => {
    if (!categoryDraft.childId) return;

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setIsSavingCategory(true);

    try {
      await fetch(
        `${API_URL}/admin/listings/${listing.id}/category`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Number(categoryDraft.childId)),
        }
      );

      await fetchListing(); // DB-truth
      setIsEditingCategory(false);
    } finally {
      setIsSavingCategory(false);
    }
  };







  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-white">
          Listing detail
        </h1>

        <Link
          href="/dashboard/listings"
          className="text-zinc-400 hover:text-white"
        >
          ← Back to listings
        </Link>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-6 text-zinc-400">

        {/* TITLE */}
        <section className="mb-8">
            <h1
            style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1.1 }}
            className="text-white"
            >
            {listing.title}
            </h1>

            <div style={{ height: 24 }} />

            <div className="mt-1 text-sm">
                Listing ID: {listing.id}
            </div>

            <div>
            User email:{" "}
            <Link
                href={`/dashboard/users/${listing.user_id}`}
                className=" hover:text-zinc-500"
            >
                {listing.user_email}
            </Link>
            </div>

        </section>

        <div style={{ height: 24 }} />

        <section className="whitespace-pre-line">
        <div className="text-zinc-300 ">
            {listing.description}
        </div>
        </section>
        
        <div style={{ height: 24 }} />

        <section>
          <h2 className="mt-6 text-white font-medium mb-2">Dates</h2>
          <div>Created: {new Date(listing.created_at).toLocaleString()}</div>
          <div>Approved: {listing.approved_at ?? "—"}</div>
          <div>Published: {listing.published_at ?? "—"}</div>
          <div>Visible until: {listing.visibility_until ?? "—"}</div>
        </section>

        <div style={{ height: 24 }} />

        <section>
        <h2 className="text-white font-medium mb-2">Status</h2>
        <div>{listing.status}</div>
        </section>


        <section>

          {!isEditingStatus && (
            <>
              <button
                onClick={startEditStatus}
                className="text-zinc-400 underline hover:text-white"
              >
                change
              </button>
            </>
          )}

          {isEditingStatus && (
            <div className="mt-3 space-y-3">
              <select
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1"
              >
                {LISTING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={saveStatus}
                  disabled={isSavingStatus}
                  className="px-3 py-1 rounded border border-zinc-600 text-zinc-300 hover:text-white disabled:opacity-50"
                >
                  save
                </button>

                <button
                  onClick={cancelEditStatus}
                  className="px-3 py-1 rounded border border-zinc-600 text-zinc-300 hover:text-white"
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </section>



        <div style={{ height: 24 }} />

        <section>
          <h2 className="mt-6 text-white font-medium mb-2">Category</h2>
          
          <div>Main category: {listing.main_category ?? "—"}</div>
          <div>Sub category: {listing.sub_category ?? "—"}</div>
        </section>




        <section>
          {!isEditingCategory && (
            <button
              onClick={startEditCategory}
              className="text-zinc-400 underline hover:text-white"
            >
              change
            </button>
          )}

          {isEditingCategory && (
            <div className="mt-3 space-y-3">
              {/* MAIN CATEGORY */}
              <select
                value={categoryDraft.parentId}
                onChange={(e) =>
                  setCategoryDraft({
                    parentId: e.target.value,
                    childId: "",
                  })
                }
                className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1"
              >
                <option value="">Select main category</option>
                {categories
                  .filter((c) => c.parent_id === null)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>

              {/* SUB CATEGORY */}
              {categoryDraft.parentId && (
                <select
                  value={categoryDraft.childId}
                  onChange={(e) =>
                    setCategoryDraft((prev) => ({
                      ...prev,
                      childId: e.target.value,
                    }))
                  }
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1"
                >
                  <option value="">Select sub category</option>
                  {categories
                    .filter(
                      (c) => c.parent_id === Number(categoryDraft.parentId)
                    )
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              )}

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={saveCategory}
                  disabled={isSavingCategory || !categoryDraft.childId}
                  className="px-3 py-1 rounded border border-zinc-600 text-zinc-300 hover:text-white disabled:opacity-50"
                >
                  save
                </button>

                <button
                  onClick={cancelEditCategory}
                  className="px-3 py-1 rounded border border-zinc-600 text-zinc-300 hover:text-white"
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </section>





        <div style={{ height: 24 }} />

        <section>
          <h2 className="mt-6 text-white font-medium mb-2">Business</h2>
          <div>Company: {listing.company ?? "—"}</div>
          <div>Email: {listing.email ?? "—"}</div>
          <div>Phone: {listing.phone_number ?? "—"}</div>
          <div>Website: {listing.website ?? "—"}</div>
          <div>WhatsApp: {listing.whatsapp ?? "—"}</div>
          <div>Instagram: {listing.instagram ?? "—"}</div>
          <div>TikTok: {listing.tiktok ?? "—"}</div>
          <div>Facebook: {listing.facebook ?? "—"}</div>
          <div>YouTube: {listing.youtube ?? "—"}</div>
          <div>Location: {listing.location ?? "—"}</div>
          <div>Tags: {listing.tags?.join(", ") ?? "—"}</div>
        </section>

        <div style={{ height: 24 }} />

        <section className="mt-8">
          <h2 className="text-white font-medium mb-2">Admin</h2>
          <div>Admin comment: {listing.admin_comment ?? "—"}</div>
        </section>

        <section>
          {!isEditingAdminComment && (
            <button
              onClick={startEditAdminComment}
              className="text-zinc-400 underline hover:text-white"
            >
              change
            </button>
          )}

          {isEditingAdminComment && (
            <div className="mt-3 space-y-3">
              <textarea
                value={adminCommentDraft}
                onChange={(e) => setAdminCommentDraft(e.target.value)}
                rows={4}
                className="w-full rounded bg-zinc-900 border border-zinc-700 p-2 text-zinc-200"
                placeholder="Admin comment…"
              />

              <div className="flex gap-3">
                <button
                  onClick={saveAdminComment}
                  disabled={isSavingAdminComment}
                  className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
                >
                  save
                </button>

                <button
                  onClick={cancelEditAdminComment}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500"
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </section>


        <div style={{ height: 24 }} />

        <section>
          <h2 className="mt-6 text-white font-medium mb-2">Clicks</h2>
          <div>Total: {listing.click_counter}</div>
          <div>Featured: {listing.click_counter_featured}</div>
          <div>Website: {listing.click_website}</div>
          <div>Email: {listing.click_email}</div>
          <div>Phone: {listing.click_phone}</div>
          <div>WhatsApp: {listing.click_whatsapp}</div>
          <div>Instagram: {listing.click_instagram}</div>
          <div>TikTok: {listing.click_tiktok}</div>
          <div>Facebook: {listing.click_facebook}</div>
          <div>YouTube: {listing.click_youtube}</div>
        </section>

        <div style={{ height: 24 }} />

        <section className="mb-8 space-y-4">
        {listing.image_url_list.map((url, idx) => (
            <div key={idx} className="relative w-full max-w-xl">
            <Image
                src={url}
                alt={`Listing image ${idx + 1}`}
                width={300}
                height={150}
                className="rounded border border-zinc-700 object-contain"
            />
            </div>
        ))}
        </section>

      </main>
    </div>
  );
}
