"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
  order_index: number;
  listing_count: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");


  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  // 🔹 betöltés
    const loadCategories = useCallback(async () => {
    try {
        const res = await fetch(`${API_URL}/categories/`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategories(data);
    } catch {
        setStatus("Failed to load categories");
    }
    }, [API_URL]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 🔹 hozzáadás
  const addCategory = async () => {
    if (!newName.trim()) return;

    setStatus("");

    try {
      const res = await fetch(`${API_URL}/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          parent_id: parentId,
        }),
      });

      if (!res.ok) {
        setStatus("Error creating category");
        return;
      }

      setNewName("");
      setParentId(null);
      setStatus("Category added");

      await loadCategories();

      setTimeout(() => setStatus(""), 2000);

    } catch {
      setStatus("Network error");
    }
  };

    // rename
    const saveRename = async (id: number) => {
    if (!editName.trim()) return;

    try {
        const res = await fetch(`${API_URL}/categories/${id}/name`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName }),
        });

        if (!res.ok) {
        setStatus("Cannot rename category");
        return;
        }

        setEditingId(null);
        setEditName("");
        setStatus("Category renamed");

        await loadCategories();
        setTimeout(() => setStatus(""), 2000);
    } catch {
        setStatus("Network error");
    }
    };


    // change order
    const moveCategory = async (cat: Category, delta: number) => {
    const newOrder = cat.order_index + delta;
    if (newOrder < 0) return;

    try {
        const res = await fetch(
        `${API_URL}/categories/${cat.id}/order/${newOrder}`,
        {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        }
        );

        if (!res.ok) {
        setStatus("Order update failed");
        return;
        }

        await loadCategories();
    } catch {
        setStatus("Network error");
    }
    };




  // 🔹 törlés
  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setStatus("Cannot delete category");
        return;
      }

      setStatus("Category deleted");
      await loadCategories();
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Network error");
    }
  };

  // 🔹 fa render
  const renderTree = (parent: number | null = null, level = 0) => {
    return categories
      .filter((c) => c.parent_id === parent)
      .map((cat) => {
        const hasChildren = categories.some(
          (c) => c.parent_id === cat.id
        );

        return (
          <div key={cat.id} style={{ marginLeft: level * 16 }}>
            <div className="flex items-center gap-3 py-1">

            <button
            disabled={cat.order_index === 0}
            onClick={() => moveCategory(cat, -1)}
            className={`text-xs ${
                cat.order_index === 0
                ? "text-zinc-600 cursor-not-allowed"
                : "text-zinc-400 hover:text-white"
            }`}
            >
            ↑
            </button>

            <button
            onClick={() => moveCategory(cat, 1)}
            className="text-xs text-zinc-400 hover:text-white"
            >
            ↓
            </button>





                {editingId === cat.id ? (
                <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm"
                    autoFocus
                />
                ) : (
                <span className="text-sm">
                    {cat.name}
                    <span className="ml-2 text-xs text-zinc-500">
                    ({cat.listing_count})
                    </span>
                </span>
                )}


              {cat.parent_id === null && (
                <button
                  onClick={() => setParentId(cat.id)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Add sub
                </button>
              )}

                {editingId === cat.id ? (
                <>
                    <button
                    onClick={() => saveRename(cat.id)}

                    className="text-xs text-green-500 hover:underline"
                    >
                    Save
                    </button>

                    <button
                    onClick={() => {
                        setEditingId(null);
                        setEditName("");
                    }}
                    className="text-xs text-zinc-400 hover:underline"
                    >
                    Cancel
                    </button>
                </>
                ) : (
                <button
                    onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                    }}
                    className="text-xs text-yellow-600 hover:underline"
                >
                    Rename
                </button>
                )}



              {!hasChildren && cat.listing_count === 0 && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>

            {renderTree(cat.id, level + 1)}
          </div>
        );
      });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-900 text-white">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
        <h1 className="text-xl font-semibold">Categories</h1>

        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to dashboard
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT – CATEGORY TREE */}
        <aside className="w-1/2 border-r border-zinc-700 p-6 overflow-y-auto">
            <h2 className="text-sm font-semibold mb-4 text-zinc-300">
            Category tree{" "}
            <span className="text-zinc-500 font-normal">
                ({categories.length})
            </span>
            </h2>


          {renderTree()}
        </aside>

        {/* RIGHT – ADD */}
        <main className="w-1/2 p-6">
          <h2 className="text-sm font-semibold mb-4 text-zinc-300">
            Add category
          </h2>

          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={
              parentId
                ? `New subcategory (parent ID: ${parentId})`
                : "New root category"
            }
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 mb-3 text-sm"
          />

          <div className="flex gap-2">
            <button
              onClick={addCategory}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
            >
              Add
            </button>

            {parentId !== null && (
              <button
                onClick={() => setParentId(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              >
                Cancel subcategory
              </button>
            )}
          </div>

          {status && (
            <p className="mt-4 text-sm text-zinc-400">{status}</p>
          )}
        </main>
      </div>
    </div>
  );
}
