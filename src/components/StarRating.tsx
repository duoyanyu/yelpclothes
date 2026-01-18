interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = true,
  className = "",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - Math.ceil(rating);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="star"
            fill="currentColor"
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <svg
            className="star"
            fill="currentColor"
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e6e6e6" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
            />
          </svg>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="star-empty"
            fill="currentColor"
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>

      {showNumber && (
        <span className="text-[#2b2b2b] font-semibold ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
