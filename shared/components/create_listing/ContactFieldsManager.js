"use client";

import { useState, useEffect } from "react";

export default function ContactFieldsManager({ form, onUpdate }) {
  const [added, setAdded] = useState(
    Object.fromEntries(Object.keys(form).map((f) => [f, !!form[f]]))
  );
  const [tempValues, setTempValues] = useState(
    Object.fromEntries(Object.keys(form).map((f) => [f, form[f] || ""]))
  );
  const [statusMsg, setStatusMsg] = useState(
    Object.fromEntries(Object.keys(form).map((f) => [f, ""]))
  );

  // ✅ ha betöltünk egy meglévő hirdetést, inicializáljuk az állapotokat
  useEffect(() => {
    setAdded(Object.fromEntries(Object.keys(form).map((f) => [f, !!form[f]])));
    setTempValues(Object.fromEntries(Object.keys(form).map((f) => [f, form[f] || ""])));
  }, [form]);

  // ✅ VALIDÁCIÓK
  const validators = {
    company: (v) => v.trim().length > 0 && v.trim().length <= 255,
    phone: (v) => /^[+]?\d{6,15}$/.test(v.trim()),
    whatsapp: (v) => /^[+]?\d{6,15}$/.test(v.trim()),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase()),
    website: (v) =>
      /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v.trim()) ||
      /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v.trim()),
    location: (v) => v.trim().length > 0,
    instagram: (v) => /^[a-zA-Z0-9._]{2,30}$/.test(v.trim()),
    tiktok: (v) => /^[a-zA-Z0-9._]{2,30}$/.test(v.trim()),
    facebook: (v) => /^[a-zA-Z0-9._]{2,50}$/.test(v.trim()),
    youtube: (v) =>
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(v.trim()),
  };

  const fields = Object.keys(validators);

  const getLabel = (field) => {
    switch (field) {
      case "company":
        return "Cég";
      case "phone":
        return "Telefonszám";
      case "email":
        return "E-mail";
      case "website":
        return "Weboldal";
      case "location":
        return "Helyszín";
      case "whatsapp":
        return "WhatsApp";
      case "instagram":
        return "Instagram";
      case "tiktok":
        return "TikTok";
      case "facebook":
        return "Facebook";
      case "youtube":
        return "YouTube";
      default:
        return field;
    }
  };

  const getPlaceholder = (field) => {
    switch (field) {
      case "company":
        return "Pl. Dubai Cleaning Services LLC";
      case "phone":
        return "+971501234567";
      case "email":
        return "example@email.com";
      case "website":
        return "https://example.com";
      case "location":
        return "Dubai, Arabian Ranches 3";
      case "whatsapp":
        return "+971501234567";
      case "instagram":
        return "instagramuser";
      case "tiktok":
        return "tiktokuser";
      case "facebook":
        return "facebookuser";
      case "youtube":
        return "https://youtube.com/@channel";
      default:
        return "";
    }
  };

  // ✅ csak a lokális input állapotot frissítjük gépeléskor
  const handleTempChange = (field, value) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ csak "Hozzáadás" után kerül be a fő formba
  const handleAdd = (field) => {
    const val = tempValues[field]?.trim() || "";
    if (!val) {
      setStatusMsg((s) => ({ ...s, [field]: "❌ Üres mező." }));
      return;
    }

    const valid = validators[field]?.(val);
    if (!valid) {
      setStatusMsg((s) => ({ ...s, [field]: "❌ Érvénytelen formátum." }));
      return;
    }

    onUpdate((prev) => ({ ...prev, [field]: val }));
    setAdded((a) => ({ ...a, [field]: true }));
    setStatusMsg((s) => ({ ...s, [field]: "✅ Hozzáadva!" }));
  };

  // ✅ Elvetés gomb
  const handleRemove = (field) => {
    setAdded((a) => ({ ...a, [field]: false }));
    setTempValues((v) => ({ ...v, [field]: "" }));
    onUpdate((prev) => ({ ...prev, [field]: "" }));
    setStatusMsg((s) => ({ ...s, [field]: "" }));
  };

  // ✅ kattintható megjelenítés
  const renderValue = (field, value) => {
    if (!value) return null;

    switch (field) {
      case "company":
        return <span className="text-black font-medium break-all">{value}</span>;

      case "phone":
        return (
          <a href={`tel:${value}`} className="text-black font-medium break-all hover:underline">
            {value}
          </a>
        );

      case "whatsapp":
        return (
          <a
            href={`https://wa.me/${value.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            {value}
          </a>
        );

      case "email":
        return (
          <a href={`mailto:${value}`} className="text-black font-medium break-all hover:underline">
            {value}
          </a>
        );

      case "website":
        return (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            {value}
          </a>
        );

      case "location":
        return (
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(value)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            {value}
          </a>
        );

      case "instagram":
        return (
          <a
            href={`https://www.instagram.com/${value.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            @{value.replace(/^@/, "")}
          </a>
        );

      case "tiktok":
        return (
          <a
            href={`https://www.tiktok.com/@${value.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            @{value.replace(/^@/, "")}
          </a>
        );

      case "facebook":
        return (
          <a
            href={`https://www.facebook.com/${value.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            {value.replace(/^@/, "")}
          </a>
        );

      case "youtube":
        return (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium break-all hover:underline"
          >
            {value}
          </a>
        );

      default:
        return <span className="text-black">{value}</span>;
    }
  };

  return (
    <>
      {fields.map((field) => (
        <div key={field} className="mt-2">
          <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
            {getLabel(field)} <span className="text-gray-500">(opcionális)</span>
          </label>

          {!added[field] ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={getPlaceholder(field)}
                value={tempValues[field] || ""}
                onChange={(e) => handleTempChange(field, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd(field);
                  }
                }}
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={() => handleAdd(field)}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:opacity-90 transition"
              >
                Hozzáadás
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              {renderValue(field, form[field])}
              <button
                type="button"
                onClick={() => handleRemove(field)}
                className="bg-red-600 text-white px-3 py-2 rounded hover:opacity-90 transition"
              >
                Elvetés
              </button>
            </div>
          )}

          {statusMsg[field] && (
            <p
              className={`text-sm mt-1 ${
                statusMsg[field].includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {statusMsg[field]}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
