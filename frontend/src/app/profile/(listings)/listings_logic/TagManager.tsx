"use client";

import { useState } from "react";

interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagManager({ tags, onChange }: TagManagerProps) {
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");

  const MAX_TAG_LEN = 40;
  const MAX_TAGS = 5;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();

    if (!trimmed) return setTagError("❌ Üres tag.");
    if (trimmed.length > MAX_TAG_LEN)
      return setTagError(`❌ Max. ${MAX_TAG_LEN} karakter.`);
    if (tags.includes(trimmed)) return setTagError("❌ Már létezik.");
    if (tags.length >= MAX_TAGS)
      return setTagError(`❌ Max. ${MAX_TAGS} tag engedélyezett.`);

    onChange([...tags, trimmed]);
    setTagInput("");
    setTagError("");
  };

  const handleRemoveTag = (t: string) => {
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
          onChange={(e) =>
            setTagInput(e.target.value.slice(0, MAX_TAG_LEN))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          disabled={tags.length >= MAX_TAGS}
          className="border p-2 rounded flex-1"
        />

        <button
          type="button"
          onClick={handleAddTag}
          disabled={tags.length >= MAX_TAGS}
          className="bg-gray-700 text-white px-3 py-2 rounded hover:opacity-90 transition disabled:opacity-50"
        >
          Hozzáadás
        </button>
      </div>

      {tagError && (
        <p className="text-sm text-red-600">{tagError}</p>
      )}

      {/* Tag lista */}
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center bg-gray-100 border border-gray-300 text-gray-800 rounded-full px-3 py-1 text-sm shadow-sm hover:bg-gray-200 transition"
          >
            {t}
            <button
              type="button"
              onClick={() => handleRemoveTag(t)}
              className="ml-2 text-gray-500 hover:text-red-600 font-bold"
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
