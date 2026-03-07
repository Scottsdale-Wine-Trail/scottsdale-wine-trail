"use client";

import { useState } from "react";

export function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm text-center hover:bg-gray-50 transition-colors"
    >
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}
