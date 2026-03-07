"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/wineries", label: "Wineries" },
  { href: "/trail-map", label: "Trail Map" },
  { href: "/events", label: "Events" },
  { href: "/wines", label: "Wines" },
  { href: "/passport", label: "Passport", highlight: true },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className={`font-serif text-lg font-semibold tracking-wide transition-colors ${
            scrolled ? "text-burgundy-700" : "text-white"
          }`}
        >
          Scottsdale Wine Trail
        </Link>
        <ul className="flex gap-8 items-center">
          {links.map(({ href, label, highlight }) => (
            <li key={href}>
              {highlight ? (
                <Link
                  href={href}
                  className={`text-sm font-semibold tracking-wide px-3 py-1.5 rounded-full transition-all ${
                    scrolled
                      ? "gold-gradient text-white shadow-sm hover:opacity-90"
                      : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                  }`}
                >
                  {label}
                </Link>
              ) : (
                <Link
                  href={href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    scrolled
                      ? "text-gray-600 hover:text-burgundy-700"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
