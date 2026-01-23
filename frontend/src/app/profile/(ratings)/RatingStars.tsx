type RatingStarsProps = {
  rating: number; // 1–5 (egész)
};

export default function RatingStars({ rating }: RatingStarsProps) {
  const value = Math.max(1, Math.min(5, Math.floor(rating)));

  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="relative w-4 h-4">
          {/* keret */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="2"
            className="absolute inset-0"
            aria-hidden
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>

          {/* kitöltött */}
          {i < value && (
            <svg
              viewBox="0 0 24 24"
              fill="#6b7280"
              className="absolute inset-0"
              aria-hidden
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
