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
          <header className="sticky top-0 z-40 border-b border-[#D8D0C2]/75 bg-[#fbfaf7]/90 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
              <Link href="/" className="group flex min-w-0 items-center gap-3 font-semibold tracking-wide">
                <span className="logo-mark grid h-9 w-9 shrink-0 place-items-center rounded-[3px] text-[0.72rem] font-black text-[#f5ead8] transition group-hover:brightness-110">
                  GTF
                </span>
                <span className="truncate text-xs uppercase tracking-[0.2em] text-[#20231E] sm:text-sm">
                  Global Trail Finder
                </span>
              </Link>
              <div className="flex shrink-0 items-center gap-1 rounded-[4px] border border-[#D8D0C2]/80 bg-white/48 p-1 text-xs font-semibold text-[#58544d] shadow-sm sm:gap-1.5 sm:text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[3px] px-2.5 py-2 transition hover:bg-white hover:text-[#20231E] hover:shadow-sm sm:px-3.5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="border-t border-[#30362c] bg-[#1E241D] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8b48a]">
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
                  className="soft-hover rounded-[3px] border border-[#d8b48a]/50 px-4 py-2.5 text-sm font-semibold text-[#f4e7d2] transition hover:bg-[#d8b48a] hover:text-[#1E241D]"
                >
                  Explore races
                </Link>
                <Link
                  href="/submit"
                  className="soft-hover rounded-[3px] border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-[#1E241D]"
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
