"use client";

import Link from "next/link";
import Image from "next/image";
import { trackListingClick } from "../../../components/trackListingClick";



type MyListingCardProps = {
  listing: {
    id: number;
    title: string;
    tags?: string[];
    rating_avg?: number | null;
    rating_count: number;
    main_image_url?: string | null;
    is_featured: boolean;
  };
};

export default function MyListingCard({ listing }: MyListingCardProps) {
  const imageUrl = listing.main_image_url ?? null;

const rating = Math.round(((listing.rating_avg ?? 0) * 2)) / 2;

  return (
        <Link
        href={`/services/service/${listing.id}`}
        className="block"
        onClick={() => {
          trackListingClick(listing.id, "listing");

          if (listing.is_featured) {
            trackListingClick(listing.id, "listing_featured");
          }
        }}
        >
        <div
            className="
            flex
            w-80
            h-40
            border
            border-gray-200
            rounded-lg
            bg-white
            overflow-hidden
            cursor-pointer
            shadow-sm
            hover:shadow-md
            transition
            relative
            "
        >
        {/* -----------------------------
            BAL OLDAL – KÉP
        ----------------------------- */}
        <div className="w-[110px] h-full bg-white flex items-center justify-center shrink-0 p-2">
            <div className="w-full aspect-3/4 overflow-hidden rounded bg-gray-200 flex items-center justify-center">
                {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={listing.title}
                    width={110}
                    height={160}
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="text-xs text-gray-400 text-center px-2">
                    Nincs kép
                </span>
                )}
            </div>
        </div>



        {/* -----------------------------
            JOBB OLDAL – TARTALOM
        ----------------------------- */}
        <div className="flex flex-col flex-1 py-3 px-1 min-w-0">
          {/* CÍM */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-3 text-black">
            {listing.title}
          </h3>



        {/* RATING */}
        <div className="flex items-center gap-2 mt-1">
        {/* ÁTLAG SZÁM */}
        <span className="text-xs font-medium text-gray-800">
            {(listing.rating_avg ?? 0).toFixed(1)}
        </span>

        {/* CSILLAGOK */}
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => {
            const fill =
                rating >= i + 1 ? "full" :
                rating >= i + 0.5 ? "half" :
                "empty";

            return (
                <span key={i} className="relative w-3.5 h-3.5">
                {/* KERET */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    className="absolute inset-0"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>

                {/* TELJES */}
                {fill === "full" && (
                    <svg
                    viewBox="0 0 24 24"
                    fill="#6b7280"
                    className="absolute inset-0"
                    >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                )}

                {/* FÉL */}
                {fill === "half" && (
                    <svg viewBox="0 0 24 24" className="absolute inset-0">
                    <defs>
                        <linearGradient id={`half-${i}`}>
                        <stop offset="50%" stopColor="#6b7280" />
                        <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        fill={`url(#half-${i})`}
                    />
                    </svg>
                )}
                </span>
            );
            })}
        </div>

        {/* DARABSZÁM */}
        <span className="text-xs text-gray-500">
            ({listing.rating_count})
        </span>
        </div>




          {/* TAGEK */}
          {listing.tags && listing.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-1 mt-2 overflow-hidden"
              style={{ maxHeight: "3rem" }}
            >
              {listing.tags.slice(0, 20).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}


        {/* FEATURED */}
        {listing.is_featured && (
          <div className="absolute top-2 left-2 z-10 bg-zinc-700 text-white text-[10px] px-2 py-0.5 rounded shadow">
            Kiemelt
          </div>
        )}




        </div>
      </div>
    </Link>
  );
}
