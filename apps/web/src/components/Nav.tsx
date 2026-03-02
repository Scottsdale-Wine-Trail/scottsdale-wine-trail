import Link from "next/link";

const links = [
  { href: "/wineries", label: "Wineries" },
  { href: "/trail-map", label: "Trail Map" },
  { href: "/events", label: "Events" },
  { href: "/wines", label: "Wines" },
];

export function Nav() {
  return (
    <nav className="bg-wine-950 text-white h-16 flex items-center px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-wine-100 hover:text-white transition-colors">
          🍷 Scottsdale Wine Trail
        </Link>
        <ul className="flex gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-wine-200 hover:text-white transition-colors text-sm font-medium"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
