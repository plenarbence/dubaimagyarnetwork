"use client";

import React from "react";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const MAX_LEN = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, MAX_LEN);
    onChange(text);
  };

  const specialChars = "• – — → ← ↑ ↓ ✓ ✔ ✘ ★ ☆ ► ▪ ▫ ⬤ ○ ⟶ ∙";

  return (
    <div className="mt-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Részletes leírás{" "}
        <span className="text-gray-500">(max. {MAX_LEN} karakter)</span>
      </label>

      <p className="text-xs text-gray-600 mb-1">
        (Hasznos karakterek: {specialChars})
      </p>

      <textarea
        placeholder="Írd le részletesen a szolgáltatásodat, ajánlatodat…"
        value={value}
        onChange={handleChange}
        rows={6}
        className="border p-2 rounded w-full resize-none"
        required
      />

      <p className="text-sm text-gray-500 text-right mt-1">
        {value.length}/{MAX_LEN}
      </p>
    </div>
  );
}
