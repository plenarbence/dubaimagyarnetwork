"use client";

import React from "react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TitleInput({ value, onChange }: TitleInputProps) {
  const MAX_LEN = 70;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.slice(0, MAX_LEN);
    onChange(text);
  };

  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Hirdetés címe{" "}
        <span className="text-gray-500">(max. {MAX_LEN} karakter)</span>
      </label>

      <input
        type="text"
        placeholder="Hirdetés címe"
        value={value}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <p className="text-sm text-gray-500 text-right mt-1">
        {value.length}/{MAX_LEN}
      </p>
    </div>
  );
}
