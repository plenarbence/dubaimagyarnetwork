"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PosterPublic = { id:number; url: string; link: string; click_count: number};

export default function PostersPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [posters, setPosters] = useState<PosterPublic[]>([]);
  const [deleteErrorId, setDeleteErrorId] = useState<number | null>(null);



  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const API_URL = process.env.NEXT_PUBLIC_API_URL;



  const fetchPosters = useCallback(async () => {
    if (!API_URL) return;

    try {
      const res = await fetch(`${API_URL}/posters`);
      if (!res.ok) {
        throw new Error("Failed to fetch posters");
      }

      const data = await res.json();
      setPosters(data);
    } catch (err) {
      console.error("Poster fetch error:", err);
    }
  }, [API_URL]);


  useEffect(() => {
    fetchPosters();
  }, [fetchPosters]);


  async function handleUpload() {
    if (!API_URL) {
      setError("API_URL is not configured.");
      return;
    }

    if (!file || !link) {
      setError("Image and link are required.");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("link", link);

    try {
      const res = await fetch(`${API_URL}/posters`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      fetchPosters();

      setSuccess(true);
      setFile(null);
      setLink("");
      setTimeout(() => setSuccess(false), 2000);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        }
    } catch {
      setError("Failed to upload poster.");
    } finally {
      setLoading(false);
    }

  }


  async function handleDelete(posterId: number) {
    setDeleteErrorId(null);

    if (!API_URL) return;

    const ok = window.confirm("Are you sure you want to delete this poster?");
    if (!ok) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posters/${posterId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      fetchPosters();
    } catch {
      setDeleteErrorId(posterId);
    }
  }












  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
        <h1 className="text-xl font-semibold">Posters</h1>

        <Link href="/dashboard" className="text-zinc-400 hover:text-white">
          ← Back to dashboard
        </Link>
      </header>

      {/* CONTENT */}
      <div className="flex flex-1 w-full">

      {/* BAL OLDAL */}
      <div className="w-1/2 border-r border-zinc-700 p-6">
        <h2 className="text-lg font-medium mb-4">Posters list</h2>

        <div className="space-y-6">
          {posters.map((poster, idx) => (
            <div
              key={idx}
              className="border border-zinc-700 rounded-md bg-zinc-900 p-4"
            >
              {/* TITLE */}
              <div className="text-sm font-medium text-zinc-300 mb-2">
                Poster #{idx + 1}
              </div>

              {/* IMAGE */}
              <Image
                src={poster.url}
                alt={`Poster ${idx + 1}`}
                width={600}
                height={300}
                className="rounded mb-3"
              />

              {/* LINK */}
              <div className="text-sm text-zinc-400 mb-3">
                Link:&nbsp;
                <a
                  href={
                    poster.link.startsWith("http")
                      ? poster.link
                      : `https://${poster.link}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:underline break-all"
                >
                  {poster.link}
                </a>
              </div>


              {/* CLICK COUNT */}
              <div className="text-xs text-zinc-400 mb-2">
                Click count: {poster.click_count}
              </div>


              {/* DELETE */}
              <button onClick={() => handleDelete(poster.id)}
                className="text-sm text-red-400 hover:underline disabled:opacity-50"
              >
                Delete
              </button>

              {deleteErrorId === poster.id && (
                <div className="text-xs text-red-400 mt-1">
                  Failed to delete poster.
                </div>
              )}



            </div>
          ))}
        </div>
      </div>







        {/* RIGHT – UPLOAD */}
        <div className="w-1/2 p-6">
          <h2 className="text-lg font-medium mb-4">Upload poster</h2>

          <div className="max-w-xl space-y-4">
            {/* IMAGE INPUT */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Poster image (2:1 landscape)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-zinc-300
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-zinc-700 file:text-white
                           hover:file:bg-zinc-600"
              />
            </div>

            {/* LINK INPUT */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Click-through link
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md bg-zinc-800 border border-zinc-700
                           px-3 py-2 text-zinc-200
                           focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            {/* FEEDBACK */}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {success && (
              <div className="text-sm text-green-400">
                Poster uploaded successfully.
              </div>
            )}

            {/* ACTION */}
            <div className="pt-2">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Upload poster"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
