"use client";

import { useRouter } from "next/navigation";

export default function ListingCard({ listing, linkTo }) {
  const router = useRouter();

  const handleClick = () => {
    const destination = linkTo || `/profile/preview/${listing.id}`;
    router.push(destination);
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white overflow-hidden w-[320px] h-[160px] flex-none"
    >
      {/* ---- BAL OLDALI KÉP ---- */}
      <div className="w-[110px] h-full flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
        {listing.main_image_url ? (
          <img
            src={listing.main_image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
            style={{ aspectRatio: "3 / 4" }}
          />
        ) : (
          <span className="text-gray-400 text-sm text-center">Nincs kép</span>
        )}
      </div>

      {/* ---- JOBB OLDALI TARTALOM ---- */}
      <div className="flex flex-col justify-between flex-1 p-3 min-w-0">
        {/* ✅ CÍM – fix zöld színnel */}
        <h3
          className="font-semibold text-sm leading-snug mb-1 text-left line-clamp-3 break-words"
          style={{ color: "#15803d" }} // Tailwind 'green-700'
        >
          {listing.title}
        </h3>

        {/* ÉRTÉKELÉS */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-gray-800 font-medium">5.0</span>
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#fbbf24"
                className="w-3.5 h-3.5"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">(100)</span>
        </div>

        {/* TAGEK */}
        {listing.tags && listing.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-1 overflow-y-auto pr-1"
            style={{ maxHeight: "3rem" }}
          >
            {listing.tags.slice(0, 50).map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full break-all"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
