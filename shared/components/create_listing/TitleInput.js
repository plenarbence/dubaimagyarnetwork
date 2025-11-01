"use client";

export default function TitleInput({ value, onChange }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Hirdetés címe{" "}
        <span className="text-gray-500">(max. 100 karakter)</span>
      </label>

      <input
        type="text"
        placeholder="Hirdetés címe"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 100))}
        className="border p-2 rounded w-full"
        required
      />

      <p className="text-sm text-gray-500 text-right mt-1">
        {value.length}/100
      </p>
    </div>
  );
}
