export function Footer() {
  return (
    <footer className="bg-wine-950 text-wine-300 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} Scottsdale Wine Trail. All rights reserved.</p>
        <p className="mt-1 text-wine-500">Arizona&apos;s Premier Wine Experience</p>
      </div>
    </footer>
  );
}
