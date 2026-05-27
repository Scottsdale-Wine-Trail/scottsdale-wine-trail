"use client";

import { useState } from "react";

const GRADIENTS = [
  "from-burgundy-500 to-burgundy-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-emerald-500 to-emerald-700",
  "from-purple-500 to-purple-700",
  "from-blue-500 to-blue-700",
];

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

function gradientFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export function ReviewerAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  const [errored, setErrored] = useState(false);
  const showPhoto = photoUrl && !errored;

  if (showPhoto) {
    return (
      <img
        src={photoUrl}
        alt={`${name}'s avatar`}
        onError={() => setErrored(true)}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientFor(
        name
      )} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
      aria-hidden="true"
    >
      {initialsFrom(name)}
    </div>
  );
}
