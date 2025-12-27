type RatingDisplayProps = {
  rating_avg: number | null;
  rating_count: number;
};

export function RatingDisplay({
  rating_avg,
  rating_count,
}: RatingDisplayProps) {
  const rating = rating_avg ?? 0;

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* ÁTLAG */}
      <span className="text-xs font-medium text-gray-800">
        {rating.toFixed(1)}
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
        ({rating_count})
      </span>
    </div>
  );
}
