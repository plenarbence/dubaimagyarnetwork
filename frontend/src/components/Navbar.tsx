"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Ellenőrzés betöltéskor és amikor az "authChange" esemény érkezik
  useEffect(() => {
    
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      // ha nincs token → kijelentkezett állapot
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          // ✅ Token érvényes
          setIsLoggedIn(true);
        } else {
          // ❌ Token hibás / lejárt → töröljük
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("authChange"));
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        // pl. nincs kapcsolat a backenddel → inkább kijelentkeztetjük
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        setIsLoggedIn(false);
      }
    };



    checkToken();
    window.addEventListener("authChange", checkToken);

    return () => {
      window.removeEventListener("authChange", checkToken);
    };
  }, [API_URL]);


  return (
    <nav className="bg-zinc-700 text-white px-6 py-2 flex items-center justify-between relative">

      {/* Bal oldal – linkek (csak desktopon) */}
      <div className="hidden md:flex gap-6 flex-1">
        <Link href="/">Főoldal</Link>
        <Link href="/listings">Szolgáltatások</Link>
        <Link href="/providers">Hirdetőknek</Link>
        <Link href="/contact">Kapcsolat</Link>
      </div>

      {/* Közép desktopon, bal oldal mobilon – logo */}
      <div className="flex justify-start md:justify-center flex-1 md:flex-none">
        <Image
          src="/logo_dmn_transparent.png"
          alt="DMN Logo"
          height={60}
          width={60}
          priority
        />
      </div>

      {/* Jobb oldal  – bejelentkezés / profil / hamburger */}
      <div className="flex justify-end items-center flex-1">
        {isLoggedIn ? (
          <Link href="/profile" className="hidden md:block hover:underline">
            Profil
          </Link>
        ) : (
          <Link href="/login" className="hidden md:block hover:underline">
            Bejelentkezés
          </Link>
        )}

        <button
          className="block md:hidden ml-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menü"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Menu className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      {/* Mobil lenyíló menü */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-800 flex flex-col text-center py-3 md:hidden z-50">
          <Link
            href="/"
            className="py-2 hover:bg-zinc-600"
            onClick={() => setIsOpen(false)}
          >
            Főoldal
          </Link>
          <Link
            href="/listings"
            className="py-2 hover:bg-zinc-600"
            onClick={() => setIsOpen(false)}
          >
            Szolgáltatások
          </Link>
          <Link
            href="/providers"
            className="py-2 hover:bg-zinc-600"
            onClick={() => setIsOpen(false)}
          >
            Hirdetőknek
          </Link>
          <Link
            href="/contact"
            className="py-2 hover:bg-zinc-600"
            onClick={() => setIsOpen(false)}
          >
            Kapcsolat
          </Link>

          {isLoggedIn ? (
            <Link
              href="/profile"
              className="py-2 hover:bg-zinc-600"
              onClick={() => setIsOpen(false)}
            >
              Profil
            </Link>
          ) : (
            <Link
              href="/login"
              className="py-2 hover:bg-zinc-600"
              onClick={() => setIsOpen(false)}
            >
              Bejelentkezés
            </Link>
          )}
        </div>
      )}

    </nav>
  );
}