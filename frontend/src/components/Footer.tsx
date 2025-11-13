"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-700 text-white text-sm py-4 mt-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Bal oldal - navigáció */}
        <div className="flex gap-6">
          <Link href="/">Főoldal</Link>
          <Link href="/listings">Szolgáltatások</Link>
          <Link href="/providers">Hirdetőknek</Link>
          <Link href="/contact">Kapcsolat</Link>
        </div>

        {/* Közép - copyright */}
        <div className="text-center text-xs">
          <p>© 2025 Dubai Magyar Network. Minden jog fenntartva.</p>
        </div>

        {/* Jobb oldal - kontakt + jogi linkek */}
        <div className="text-xs text-center md:text-right">
          <p>
            Kapcsolat:{" "}
            <a
              href="mailto:info@dubaimagyarnetwork.com"
              className="whitespace-nowrap hover:underline"
            >
              info@dubaimagyarnetwork.com
            </a>{" "}
            |{" "}
            <a
              href="tel:+971551301055"
              className="whitespace-nowrap hover:underline"
            >
              +971 55 130 1055
            </a>
          </p>

          <p className="mt-1">
            <Link href="/terms" className="hover:underline">
              Felhasználási feltételek
            </Link>
            <span className="mx-1">·</span>
            <Link href="/privacy" className="hover:underline">
              Adatvédelmi nyilatkozat
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
