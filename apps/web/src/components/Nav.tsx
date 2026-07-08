"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

// Routes that don't have a dark hero behind the nav, so the nav needs to
// render in its solid (scrolled) variant from the start to stay readable.
const ALWAYS_SOLID_ROUTES = new Set(["/map", "/trail-map"]);

type NavLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

const primaryLinks: NavLink[] = [
  { href: "/wineries", label: "Wineries" },
  { href: "/trail-map", label: "Trail Map" },
  { href: "/events", label: "Events" },
  { href: "/wines", label: "Wines" },
];

const moreLinks: NavLink[] = [
  { href: "/tours", label: "Guided Tours" },
  { href: "/concierge", label: "Concierge" },
  { href: "/blog", label: "Blog" },
  { href: "/merch", label: "Merch" },
];

const passportLink: NavLink = {
  href: "/passport",
  label: "Passport",
  highlight: true,
};

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  const forceSolid = useMemo(
    () => ALWAYS_SOLID_ROUTES.has(pathname ?? ""),
    [pathname]
  );
  const solid = scrolled || forceSolid;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [moreOpen]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 transition-all duration-300 ${
        solid
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Scottsdale Wine Trail — home"
          onClick={() => setMenuOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Scottsdale Wine Trail"
            className={`h-9 w-auto transition-all duration-300 ${
              solid
                ? ""
                : "[filter:brightness(0)_invert(1)_drop-shadow(0_1px_6px_rgba(0,0,0,0.45))]"
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6 lg:gap-8 items-center">
          {primaryLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  solid
                    ? "text-gray-600 hover:text-burgundy-700"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* More dropdown */}
          <li className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className={`text-sm font-medium tracking-wide transition-colors flex items-center gap-1 ${
                solid
                  ? "text-gray-600 hover:text-burgundy-700"
                  : "text-white/90 hover:text-white"
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                {moreLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cream hover:text-burgundy-700 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </li>

          <li>
            <Link
              href={passportLink.href}
              className={`text-sm font-semibold tracking-wide px-3 py-1.5 rounded-full transition-all ${
                solid
                  ? "gold-gradient text-white shadow-sm hover:opacity-90"
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
              }`}
            >
              {passportLink.label}
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className={`md:hidden flex flex-col items-center justify-center w-9 h-9 gap-1 rounded-lg ${
            solid
              ? "text-burgundy-700 hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
        >
          <span
            className={`block w-5 h-0.5 bg-current transition-transform ${
              menuOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-transform ${
              menuOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg border-t border-gray-100">
          <ul className="flex flex-col py-2">
            {[...primaryLinks, ...moreLinks].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-sm text-gray-700 font-medium hover:bg-cream hover:text-burgundy-700 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-3 border-t border-gray-100 mt-2">
              <Link
                href={passportLink.href}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center gold-gradient text-white font-semibold px-4 py-2.5 rounded-full text-sm shadow-sm"
              >
                {passportLink.label}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
