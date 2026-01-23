"use client";

import { useState } from "react";
import Link from "next/link";
import TextboxEditor from "./TextboxEditor";

const CONTENT_KEYS = ["aboutus", "contact", "privacy", "faq", "terms"];

export default function TextboxesPage() {
  const [selectedKey, setSelectedKey] = useState<string>("contact");

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-900 text-white">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
        <h1 className="text-xl font-semibold">Textboxes</h1>

        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to dashboard
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT – KEY LIST */}
        <aside className="w-64 bg-zinc-800 border-r border-zinc-700 p-4">
          <ul className="space-y-1">
            {CONTENT_KEYS.map((key) => (
              <li
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`cursor-pointer px-3 py-2 rounded text-sm ${
                  selectedKey === key
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-300 hover:bg-zinc-700/50"
                }`}
              >
                {key}
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT – EDITOR */}
        <main className="flex-1 p-6 overflow-hidden">
          <TextboxEditor contentKey={selectedKey} />
        </main>
      </div>
    </div>
  );
}
