import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-wine-900 mb-3">Page not found</h1>
      <p className="text-wine-700 mb-6">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="inline-flex bg-wine-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-wine-800"
      >
        Back home
      </Link>
    </div>
  );
}
