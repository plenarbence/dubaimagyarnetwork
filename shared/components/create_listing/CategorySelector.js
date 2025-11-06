"use client";

import { useEffect, useState } from "react";

export default function CategorySelector({ value, onChange }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [categories, setCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ ha kívülről jön (pl. betöltött listing) -> frissítjük a helyi state-et
  useEffect(() => {
    if (value) {
      setSelectedParent(value.parentId || "");
      setSelectedChild(value.childId || "");
    }
  }, [value]);

  // ✅ kategóriák betöltése
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/categories/`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.detail || "Nem sikerült betölteni a kategóriákat."
          );
        setCategories(data);
      } catch (err) {
        console.error("❌ Kategória betöltési hiba:", err);
        setError("Nem sikerült betölteni a kategóriákat.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [API_URL]);

  const parentCats = categories.filter((c) => c.parent_id === null);
  const childCats = categories.filter(
    (c) => c.parent_id === Number(selectedParent)
  );

  const handleParentChange = (id) => {
    setSelectedParent(id);
    setSelectedChild("");
    onChange?.({ parentId: id, childId: "" });
  };

  const handleChildChange = (id) => {
    setSelectedChild(id);
    onChange?.({ parentId: selectedParent, childId: id });
  };

  if (loading)
    return (
      <p className="text-sm text-gray-500 italic mt-4">
        Kategóriák betöltése...
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-600 mt-4">
        {error}
      </p>
    );

  return (
    <div className="mt-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Kategória <span className="text-gray-500">(opcionális)</span>
      </label>

      {/* ✅ Főkategória */}
      <select
        value={selectedParent}
        onChange={(e) => handleParentChange(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Válassz fő kategóriát</option>
        {parentCats.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* ✅ Alkategória */}
      {selectedParent && childCats.length > 0 && (
        <select
          value={selectedChild}
          onChange={(e) => handleChildChange(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Válassz alkategóriát</option>
          {childCats.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      {selectedParent && childCats.length === 0 && (
        <p className="text-sm text-gray-500 italic mt-1">
          Nincs alkategória, csak a fő kategória kerül hozzárendelésre.
        </p>
      )}
    </div>
  );
}
