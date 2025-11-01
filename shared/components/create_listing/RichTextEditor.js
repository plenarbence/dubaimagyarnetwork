"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";

// 🔹 Font-size-t támogató kiterjesztett TextStyle
const ExtendedTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: "16px",
        parseHTML: (el) => el.style.fontSize || null,
        renderHTML: (attrs) =>
          attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
      },
    };
  },
});

export default function RichTextEditor({ value = "", onChange, maxLength = 1000 }) {
  // csak a toolbar állapot-váltás megjelenítéséhez (nem mountoljuk újra az editort!)
  const [, setToolbarTick] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, ExtendedTextStyle],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const textOnly = editor.getText();
      onChange?.(html, textOnly.length);
    },
    onSelectionUpdate: () => setToolbarTick((v) => !v),
    onTransaction: () => setToolbarTick((v) => !v),
  });

  if (!editor) return <p className="p-4 text-gray-500">Editor betöltése…</p>;

  const currentLen = editor.getText().length;

  return (
    <div className="mt-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Részletes leírás{" "}
        <span className="text-gray-500">(max. {maxLength} karakter)</span>
      </label>

      {/* 🔹 TOOLBAR (eredeti stílusban) */}
      <div className="tiptap-toolbar flex flex-wrap items-center gap-2 mb-2 border p-2 rounded bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`tt-btn ${editor.isActive("bold") ? "active" : ""}`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`tt-btn italic ${editor.isActive("italic") ? "active" : ""}`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`tt-btn underline ${editor.isActive("underline") ? "active" : ""}`}
        >
          U
        </button>

        {/* 🔹 Bullet list */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tt-btn ${editor.isActive("bulletList") ? "active" : ""}`}
        >
          •
        </button>

        {/* 🔹 Ordered list */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tt-btn ${editor.isActive("orderedList") ? "active" : ""}`}
        >
          1.
        </button>

        {/* 🔹 Font size selector */}
        <select
          className="border rounded p-1 text-sm ml-2"
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: e.target.value })
              .run()
          }
          value={editor.getAttributes("textStyle").fontSize || "16px"}
        >
          <option value="12px">12 px</option>
          <option value="14px">14 px</option>
          <option value="16px">16 px</option>
          <option value="18px">18 px</option>
          <option value="20px">20 px</option>
        </select>
      </div>

      {/* 🔹 Editor content (NINCS key ⇒ nincs remount) */}
      <div className="tiptap-wrap border rounded min-h-[220px] p-3 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* 🔹 Karakterszámláló */}
      <p
        className={`text-sm mt-1 text-right ${
          currentLen > maxLength ? "text-red-600 font-medium" : "text-gray-500"
        }`}
      >
        {currentLen}/{maxLength}
      </p>
    </div>
  );
}
