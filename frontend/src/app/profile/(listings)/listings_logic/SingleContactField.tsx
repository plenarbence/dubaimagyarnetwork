"use client";

import { useState } from "react";
import type { ContactFieldName } from "./ContactFieldsConfig";
import {
  CONTACT_LABELS,
  CONTACT_PLACEHOLDERS,
  CONTACT_MAX_LENGTHS,
  CONTACT_FIELDS_WITH_TEST,
} from "./ContactFieldsConfig";
import { CONTACT_VALIDATORS } from "./contactValidators";

interface SingleContactFieldProps {
  field: ContactFieldName;
  value: string;
  onChange: (next: string) => void;
}

export default function SingleContactField({
  field,
  value,
  onChange,
}: SingleContactFieldProps) {
  const [msg, setMsg] = useState("");
  const [testLink, setTestLink] = useState("");

  const maxLen = CONTACT_MAX_LENGTHS[field];

  const handleTest = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      setMsg("Üres mező.");
      setTestLink("");
      return;
    }

    const validate = CONTACT_VALIDATORS[field];
    if (validate && !validate(trimmed)) {
      setMsg("Helytelen formátum.");
      setTestLink("");
      return;
    }

    setMsg("");

    // link generálás
    let link = trimmed;

    if (field === "phone") link = `tel:${trimmed}`;
    if (field === "whatsapp") link = `https://wa.me/${trimmed.replace(/[^\d]/g, "")}`;
    if (field === "email") link = `mailto:${trimmed}`;
    if (field === "website") link = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    if (field === "location") link = `https://maps.google.com/?q=${encodeURIComponent(trimmed)}`;
    if (field === "instagram") link = `https://instagram.com/${trimmed.replace(/^@/, "")}`;
    if (field === "tiktok") link = `https://tiktok.com/@${trimmed.replace(/^@/, "")}`;
    if (field === "facebook") link = `https://facebook.com/${trimmed.replace(/^@/, "")}`;
    if (field === "youtube") link = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    setTestLink(link);
  };

  return (
    <div className="mt-3">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {CONTACT_LABELS[field]} <span className="text-gray-500">(opcionális)</span>
      </label>

      <input
        type="text"
        placeholder={CONTACT_PLACEHOLDERS[field]}
        value={value}
        maxLength={maxLen}
        onChange={(e) => {
          onChange(e.target.value.slice(0, maxLen)); // ← MAX LENGTH ÉRVÉNYESÍTVE
          setMsg("");
          setTestLink("");
        }}
        className="border p-2 rounded w-full"
      />

      {CONTACT_FIELDS_WITH_TEST.includes(field) && (
        <button
          type="button"
          onClick={handleTest}
          className="mt-2 bg-gray-700 text-white px-3 py-2 rounded hover:opacity-90"
        >
          Teszt
        </button>
      )}


      {CONTACT_FIELDS_WITH_TEST.includes(field) && msg && (
        <p className={`text-sm mt-1 ${"text-red-600" }`} >
          {msg}
        </p>
      )}


      {CONTACT_FIELDS_WITH_TEST.includes(field) && testLink && (
        <a
          href={testLink}
          target="_blank"
          className="block text-black mt-1 break-all"
        >
          {value.trim()}
        </a>
      )}

    </div>
  );
}
