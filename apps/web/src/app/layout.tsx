import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Scottsdale Wine Trail",
    template: "%s | Scottsdale Wine Trail",
  },
  description:
    "Discover Arizona's premier wine trail featuring world-class wineries, tasting rooms, and events in Scottsdale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <Nav />
          <main className="min-h-[100dvh] pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
