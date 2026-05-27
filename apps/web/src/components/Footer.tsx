import Link from "next/link";

const EXPLORE_LINKS = [
  { href: "/wineries", label: "Wineries" },
  { href: "/trail-map", label: "Trail Map" },
  { href: "/events", label: "Events" },
  { href: "/wines", label: "Wines" },
];

const VISIT_LINKS = [
  { href: "/passport", label: "Passport" },
  { href: "/tours", label: "Guided Tours" },
  { href: "/concierge", label: "Concierge" },
  { href: "/blog", label: "Blog" },
  { href: "/merch", label: "Merch" },
];

export function Footer() {
  return (
    <footer className="wine-gradient text-white py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl font-semibold mb-2">
              Scottsdale Wine Trail
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              Arizona&apos;s premier wine experience. Six award-winning tasting
              rooms within walking distance in downtown Scottsdale.
            </p>
          </div>

          {/* Explore */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                Explore
              </p>
              <ul className="space-y-2">
                {EXPLORE_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                Plan Your Visit
              </p>
              <ul className="space-y-2">
                {VISIT_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
              Concierge
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:9712697715"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  971-269-7715
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@scottsdalewinetrail.com"
                  className="text-white/80 hover:text-white transition-colors break-all"
                >
                  info@scottsdalewinetrail.com
                </a>
              </li>
            </ul>
            <Link
              href="/concierge"
              className="inline-block mt-4 text-xs font-semibold uppercase tracking-wider text-gold-300 hover:text-gold-200 transition-colors"
            >
              Contact the Concierge →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} Scottsdale Wine Trail. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
