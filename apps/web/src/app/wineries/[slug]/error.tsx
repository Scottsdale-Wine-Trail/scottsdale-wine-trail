"use client";

export default function WineryDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <p className="text-red-700 mb-3">Unable to load winery details.</p>
      <button
        type="button"
        onClick={reset}
        className="border border-wine-300 text-wine-700 px-4 py-2 rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}
