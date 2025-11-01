"use client";

import { useState } from "react";

export default function TagManager({ tags, onChange }) {
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return setTagError("❌ Üres tag.");
    if (trimmed.length > 50) return setTagError("❌ Max. 50 karakter.");
    if (tags.includes(trimmed)) return setTagError("❌ Már létezik.");
    if (tags.length >= 5) return setTagError("❌ Max. 5 tag engedélyezett.");

    onChange([...tags, trimmed]);
    setTagInput("");
    setTagError("");
  };

  const handleRemoveTag = (t) => {
    onChange(tags.filter((x) => x !== t));
  };

  return (
    <div className="mt-2">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Kulcsszavak <span className="text-gray-500">(opcionális)</span>
      </label>

      <div className="flex gap-2 items-center mb-2">
        <input
          type="text"
          placeholder="Pl. gyerekbarát, masszázs, autóbérlés"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value.slice(0, 50))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          className="border p-2 rounded flex-1"
          disabled={tags.length >= 5}
        />

        <button
          type="button"
          onClick={handleAddTag}
          disabled={tags.length >= 5}
          className="bg-gray-700 text-white px-3 py-2 rounded hover:opacity-90 transition disabled:opacity-50"
        >
          Hozzáadás
        </button>
      </div>

      {tagError && <p className="text-sm text-red-600">{tagError}</p>}

      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
          >
            {t}
            <button
              type="button"
              onClick={() => handleRemoveTag(t)}
              className="ml-2 text-red-600 font-bold"
              aria-label={`Tag törlése: ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
