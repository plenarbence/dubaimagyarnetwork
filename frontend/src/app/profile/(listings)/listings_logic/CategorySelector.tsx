"use client";

import { useEffect, useState } from "react";

interface CategorySelectorProps {
  value: { parentId: string; childId: string };
  onChange: (next: { parentId: string; childId: string }) => void;
}

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}


export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // lokális state-ek (UI-hoz)
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  // ----------- EDIT PAGE: bejövő érték belövése -----------
  useEffect(() => {
    if (value) {
      setSelectedParent(value.parentId || "");
      setSelectedChild(value.childId || "");
    }
  }, [value]);

  // ----------- Kategóriák betöltése -----------
  useEffect(() => {
    const loadCats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/categories/`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.detail || "Betöltési hiba");
        setCategories(data);
      } catch (err) {
        console.error("Category load error:", err);
        setError("Nem sikerült betölteni a kategóriákat.");
      } finally {
        setLoading(false);
      }
    };

    loadCats();
  }, [API_URL]);

  const parentCats = categories.filter((c) => c.parent_id === null);
  const childCats = categories.filter((c) => c.parent_id === Number(selectedParent));

  // ----------- Parent change -----------
  const handleParentChange = (id: string) => {
    setSelectedParent(id);
    setSelectedChild("");

    onChange({
      parentId: id,
      childId: "",
    });
  };

  // ----------- Child change -----------
  const handleChildChange = (id: string) => {
    setSelectedChild(id);

    onChange({
      parentId: selectedParent,
      childId: id,
    });
  };

  // ----------- Loading / Error -----------
  if (loading)
    return <p className="text-sm text-gray-500 italic mt-4">Kategóriák betöltése…</p>;

  if (error)
    return <p className="text-sm text-red-600 mt-4">{error}</p>;

  // ----------- UI -----------
  return (
    <div className="mt-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Kategória <span className="text-gray-500">(opcionális)</span>
      </label>

      {/* ------ Fő kategória ------ */}
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

      {/* ------ Alkategória ------ */}
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

      {/* nincs alkategória */}
      {selectedParent && childCats.length === 0 && (
        <p className="text-sm text-gray-500 italic mt-1">
          Ehhez a fő kategóriához nincs alkategória.
        </p>
      )}
    </div>
  );
}
