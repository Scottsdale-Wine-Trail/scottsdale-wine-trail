"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GoogleReview } from "@/lib/data/reviews";
import { ReviewerAvatar } from "./ReviewerAvatar";

// useLayoutEffect throws a warning on SSR; this hook silently falls back to
// useEffect on the server so the build is clean.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Stars({
  value,
  size = 16,
  color = "hsl(43, 100%, 50%)",
}: {
  value: number;
  size?: number;
  color?: string;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const tiles: ("full" | "half" | "empty")[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) tiles.push("full");
    else if (i === full && half) tiles.push("half");
    else tiles.push("empty");
  }
  return (
    <div className="inline-flex items-center gap-0.5" aria-hidden="true">
      {tiles.map((kind, i) => {
        const gradId = `rc-half-${i}-${value}`;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={kind === "empty" ? "none" : "currentColor"}
            stroke="currentColor"
            strokeWidth="1"
            style={{ color }}
          >
            {kind === "half" && (
              <defs>
                <linearGradient id={gradId}>
                  <stop offset="50%" stopColor={color} />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z"
              fill={kind === "half" ? `url(#${gradId})` : undefined}
            />
          </svg>
        );
      })}
    </div>
  );
}

type Variant = "light" | "dark";

const VARIANT_CLASSES: Record<
  Variant,
  {
    card: string;
    body: string;
    name: string;
    meta: string;
    expand: string;
    starColor: string;
  }
> = {
  light: {
    card: "block bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-burgundy-200 transition-all",
    body: "text-sm text-gray-700 leading-relaxed",
    name: "font-semibold text-gray-900 text-sm leading-snug",
    meta: "text-xs text-gray-400",
    expand: "text-xs font-semibold text-burgundy-600 hover:text-burgundy-800",
    starColor: "hsl(43, 100%, 50%)",
  },
  dark: {
    card: "block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-colors",
    body: "text-base italic text-white/90 leading-relaxed",
    name: "font-semibold text-white text-sm leading-snug",
    meta: "text-white/60 text-xs",
    expand: "text-xs font-semibold text-gold-300 hover:text-gold-200",
    starColor: "hsl(43, 100%, 60%)",
  },
};

export function ReviewCard({
  review,
  variant = "light",
  initialClampLines = 5,
  showWinery = false,
}: {
  review: GoogleReview;
  variant?: Variant;
  initialClampLines?: number;
  showWinery?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const v = VARIANT_CLASSES[variant];

  // Measure whether the clamped text is actually overflowing. This is the
  // only reliable signal — char-length heuristics fire false positives when
  // a review has line breaks or is just a bit over the threshold.
  useIsoLayoutEffect(() => {
    function measure() {
      const el = textRef.current;
      if (!el) return;
      const isOverflowing = el.scrollHeight - el.clientHeight > 1;
      setOverflows(isOverflowing);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [review.text, initialClampLines]);

  function toggle(e: React.MouseEvent) {
    // Toggling expand should not navigate away.
    e.preventDefault();
    e.stopPropagation();
    setExpanded((s) => !s);
  }

  const inner = (
    <>
      <div className="flex items-start gap-3 mb-2">
        <ReviewerAvatar
          name={review.authorName}
          photoUrl={review.authorPhotoUrl}
        />
        <div className="min-w-0 flex-1">
          <p className={v.name}>{review.authorName}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <Stars value={review.rating} color={v.starColor} />
            {review.relativePublishTime && (
              <span className={v.meta}>{review.relativePublishTime}</span>
            )}
            {showWinery && review.wineryName && (
              <span className={v.meta}>
                · {review.wineryName}
              </span>
            )}
          </div>
        </div>
      </div>

      <p
        ref={textRef}
        className={`${v.body} whitespace-pre-line`}
        style={
          !expanded
            ? {
                display: "-webkit-box",
                WebkitLineClamp: initialClampLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {review.text}
      </p>

      {(overflows || expanded) && (
        <button
          type="button"
          onClick={toggle}
          className={`mt-2 ${v.expand} transition-colors`}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );

  if (review.googleUrl) {
    return (
      <a
        href={review.googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read ${review.authorName}'s review on Google`}
        className={v.card}
      >
        {inner}
      </a>
    );
  }
  return <div className={v.card}>{inner}</div>;
}
