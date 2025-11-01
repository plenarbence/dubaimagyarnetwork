"use client";

import { useRouter } from "next/navigation";

export default function ListingCard({ listing, linkTo }) {
  const router = useRouter();

  const handleClick = () => {
    // ha kapott linket → oda navigál
    // ha nem kapott → fallback: /profile/preview/{id}
    const destination = linkTo || `/profile/preview/${listing.id}`;
    router.push(destination);
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden w-[400px] h-[200px] bg-white"
    >
      {/* Bal oldali kép (3:4 arány, fix méret) */}
      <div className="w-[150px] h-full flex-shrink-0 flex items-center justify-center p-2">
        {listing.main_image_url ? (
          <img
            src={listing.main_image_url}
            alt={listing.title}
            className="w-full h-full object-cover rounded-md"
            style={{ aspectRatio: "3 / 4" }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
            Nincs kép
          </div>
        )}
      </div>

      {/* Jobb oldali tartalom */}
      <div className="flex flex-col justify-start flex-1 p-3 min-w-0">
        {/* ✅ Cím — több sorba törhet, nem vágódik el */}
        <h3 className="font-semibold text-gray-800 text-[0.95rem] leading-[1.25rem] mb-2 text-left break-words line-clamp-4 pb-1">
          {listing.title}
        </h3>

        {/* Értékelés */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm text-gray-800 font-medium">5.0</span>
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#fbbf24"
                className="w-4 h-4"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">(100)</span>
        </div>

        {/* Tagek — görgethető blokk */}
        {listing.tags && listing.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-1 mt-1 overflow-y-auto pr-1"
            style={{ maxHeight: "4.5rem" }} // kb. 5 sor
          >
            {listing.tags.slice(0, 50).map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full break-all"
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
