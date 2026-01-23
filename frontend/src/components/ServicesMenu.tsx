"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRef } from "react";


type Category = {
  id: number;
  name: string;
  slug: string;
  listing_count: number;
};


type Props = {
  onSelect?: () => void;
};




export default function ServicesMenu({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/public/main`
        );
        if (!res.ok) return;

        const data = await res.json();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
        ) {
        setOpen(false);
        }
    }

    if (open) {
        document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, [open]);


  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
            text-white cursor-pointer
            block w-full text-center py-2
            hover:bg-zinc-600
            md:w-auto md:py-0
            md:hover:bg-transparent
            md:flex md:items-center md:gap-1
            "
      >
        Hirdetések
      </button>

      {/* Desktop dropdown */}
      {open && (
        <div
            className={`hidden md:block absolute left-0 w-72 top-full mt-4 bg-zinc-700 text-white shadow-lg z-50 max-h-[420px] overflow-y-auto`}
            >

        
          <Link
            href="/services"
            className="block px-4 py-2 hover:bg-zinc-600"
            onClick={() => setOpen(false)}            
          >
            Összes
          </Link>

          {!loading &&
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services/${cat.slug}`}
                className="flex justify-between px-4 py-2 hover:bg-zinc-600"
                onClick={() => setOpen(false)}
              >
                <span>{cat.name}</span>

              </Link>
            ))}
        </div>
      )}

      {/* Mobile submenu */}
            {open && (
              <div className="md:hidden w-full bg-zinc-700 text-white" >
            
          <Link
            href="/services"
            className="block py-2 hover:bg-zinc-600 text-center"
            onClick={() => {
            setOpen(false);
            onSelect?.();
            }}
          >
            Összes
          </Link>

          {!loading &&
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services/${cat.slug}`}
                className="block py-2 hover:bg-zinc-600 text-center"
                onClick={() => {
                setOpen(false);
                onSelect?.();
                }}
              >
                {cat.name} 
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
