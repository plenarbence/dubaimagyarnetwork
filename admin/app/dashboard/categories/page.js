"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [status, setStatus] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  // 🔹 gyermek kategóriák gyors leképezése
  const childrenMap = useMemo(() => {
    const map = new Map();
    for (const c of categories) {
      const key = c.parent_id ?? "root";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return map;
  }, [categories]);

  const hasChildren = (id) => (childrenMap.get(id) || []).length > 0;

  // 🔹 kategóriák betöltése — stabil referenciával
  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Fetch error");
      const data = await res.json();

      setCategories(data);
      setStatus("");
      console.log("categories:", data);
    } catch {
      setStatus("⚠️ Nem sikerült betölteni a kategóriákat");
    }
  }, [API_URL]);

  // 🔹 új kategória hozzáadása
  const addCategory = async () => {
    if (!newName.trim()) return;
    setStatus("");
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, parent_id: parentId }),
      });
      if (res.ok) {
        setNewName("");
        setParentId(null);
        setCategories([]);
        await loadCategories();
        setStatus("✅ Kategória hozzáadva");
      } else if (res.status === 401) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      } else {
        setStatus("❌ Hiba történt a mentéskor");
      }
    } catch {
      setStatus("⚠️ Hálózati hiba");
    }
  };

  // 🔹 kategória törlése
  const deleteCategory = async (id) => {
    if (!confirm("Biztosan törlöd ezt a kategóriát?")) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setParentId(null);
        await loadCategories();
        setStatus("🗑️ Kategória törölve");
      } else if (res.status === 401) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      } else if (res.status === 409) {
        setStatus("❌ Előbb töröld az alkategóriákat ehhez a főkategóriához.");
      } else if (res.status === 404) {
        setStatus("❌ A kategória nem található (404).");
      } else {
        setStatus("❌ Hiba történt törlés közben");
      }
    } catch {
      setStatus("⚠️ Hálózati hiba");
    }
  };

  // 🔹 komponens betöltésekor kategóriák lekérése
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 🔹 kategóriafa rekurzív megjelenítése
  const renderTree = (parent = null, level = 0) => {
    return categories
      .filter((cat) => cat.parent_id === parent)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((cat) => {
        const isRoot = cat.parent_id === null;
        const showAddSub = isRoot;
        const showDelete = !isRoot || (isRoot && !hasChildren(cat.id));

        return (
          <div key={cat.id} style={{ marginLeft: `${level * 20}px` }}>
            <div className="flex items-center gap-3">
              <span className="font-medium">{cat.name}</span>

              {showAddSub && (
                <button
                  onClick={() => setParentId(cat.id)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Add sub-cat
                </button>
              )}

              {showDelete && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              )}
            </div>

            <div>{renderTree(cat.id, level + 1)}</div>
          </div>
        );
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Kategóriák szerkesztése</h1>

      {/* 🔹 Új kategória űrlap */}
      <div className="mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={
            parentId
              ? `Új alkategória (parent ID: ${parentId})`
              : "Új főkategória neve"
          }
          className="border rounded px-3 py-2 w-full mb-2"
        />
        <div className="flex gap-2">
          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Hozzáadás
          </button>
          <button
            onClick={() => setParentId(null)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Főkategória mód
          </button>
        </div>
      </div>

      {/* 🔹 Kategóriafa */}
      <div className="space-y-2">{renderTree()}</div>

      {/* 🔹 Status üzenet a fa alatt */}
      {status && (
        <p className="mt-4 text-sm text-gray-700 font-medium">{status}</p>
      )}

      {/* 🔹 Debug lista */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          📋 Összes kategória (debug)
        </h2>
        <div className="space-y-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between text-sm"
            >
              <span>
                {cat.name}{" "}
                <span className="ml-2 text-gray-500 text-xs">
                  (id: {cat.id}, parent_id: {String(cat.parent_id)})
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
