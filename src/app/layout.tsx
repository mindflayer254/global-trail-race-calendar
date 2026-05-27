import type { Metadata } from "next";
import Link from "next/link";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "global trail races",
    "trail running calendar",
    "ultra trail races",
    "international trail runners",
    "race calendar",
  ],
  authors: [{ name: "Global Trail Race Finder" }],
  creator: "Global Trail Race Finder",
  publisher: "Global Trail Race Finder",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const navItems = [
  { href: "/races", label: "Race Calendar" },
  { href: "/submit", label: "Submit Race" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-[#ded8cc]/80 bg-[#fbfaf7]/88 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
              <Link href="/" className="flex min-w-0 items-center gap-3 font-semibold tracking-wide">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[2px] bg-[#191917] text-sm font-bold text-white shadow-sm">
                  CT
                </span>
                <span className="truncate text-xs uppercase tracking-[0.16em] sm:text-sm">
                  Global Trail Finder
                </span>
              </Link>
              <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#4a4740] sm:gap-2 sm:text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[2px] px-2.5 py-2 transition hover:bg-white hover:text-[#191917] hover:shadow-sm sm:px-3"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="border-t border-[#2d2b26] bg-[#191917] text-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b48a]">
                  Public race discovery
                </p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#d6d2c7]">
                  This MVP aggregates publicly available trail race information and points
                  runners to official websites and registration pages. Always confirm final
                  details with the organizer before booking travel.
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-3 md:justify-end">
                <Link
                  href="/races"
                  className="rounded-[2px] border border-[#d7b48a]/50 px-4 py-2.5 text-sm font-semibold text-[#f4e7d2] transition hover:bg-[#d7b48a] hover:text-[#191917]"
                >
                  Explore races
                </Link>
                <Link
                  href="/submit"
                  className="rounded-[2px] border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-[#191917]"
                >
                  Submit a race
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
