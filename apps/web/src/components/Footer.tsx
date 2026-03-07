export function Footer() {
  return (
    <footer className="wine-gradient text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <p className="font-serif text-2xl font-semibold mb-2">Scottsdale Wine Trail</p>
          <p className="text-white/70 text-sm">Arizona&apos;s Premier Wine Experience</p>
        </div>
        <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Scottsdale Wine Trail. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
