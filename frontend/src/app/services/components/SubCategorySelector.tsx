"use client";

import { useEffect, useState } from "react";

type SubCategory = {
  id: number;
  name: string;
  listing_count: number;
};

type Props = {
  parentCategoryId: number;
  selectedSubCategoryId: number | null;
  onSelect: (subCategoryId: number | null) => void;
};

export default function SubCategorySelector({
  parentCategoryId,
  selectedSubCategoryId,
  onSelect,
}: Props) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/public/${parentCategoryId}/subcategories`
        );
        if (!res.ok) return;

        const data = await res.json();
        setSubCategories(data);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [parentCategoryId]);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-24 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const totalCount = subCategories.reduce(
    (sum, s) => sum + s.listing_count,
    0
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {/* ÖSSZES */}
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm hover:bg-gray-100 ${
          selectedSubCategoryId === null ? "bg-gray-100 font-medium" : ""
        }`}
      >
        Összes
        <span className="ml-1 text-gray-500">({totalCount})</span>
      </button>

      {subCategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onSelect(sub.id)}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm hover:bg-gray-100 ${
            selectedSubCategoryId === sub.id ? "bg-gray-100 font-medium" : ""
          }`}
        >
          {sub.name}
          <span className="ml-1 text-gray-500">
            ({sub.listing_count})
          </span>
        </button>
      ))}
    </div>
  );
}
