"use client";

import { useState, useEffect } from "react";


type Props = {
  contentKey: string;
};

export default function TextboxEditor({ contentKey }: Props) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


    useEffect(() => {
    setValue("");
    const fetchContent = async () => {
        try {
        const res = await fetch(`${API_URL}/content/${contentKey}`);
        if (!res.ok) return;

        const data = await res.json();
        setValue(data.value ?? "");
        } catch {
        setValue("");
        }
    };

    fetchContent();
    }, [contentKey, API_URL]);




  const handleSave = async () => {
    setSaving(true);
    setStatus("");

    const token = localStorage.getItem("admin_token");

    try {
      const res = await fetch(`${API_URL}/content/${contentKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      if (!res.ok) throw new Error();

      setStatus("Saved");

      setTimeout(() => {
        setStatus("");
        }, 2000);
    } catch {
      setStatus("Error saving");
      setTimeout(() => {
        setStatus("");
        }, 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3">
        {contentKey}
      </h2>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 w-full bg-zinc-900 border border-zinc-700 rounded p-4 text-white resize-none"
        placeholder="<p>HTML content</p>"
      />

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <span className="text-sm text-zinc-400">{status}</span>
      </div>
    </div>
  );
}
