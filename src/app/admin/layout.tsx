import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="border-b border-[#ded8cc] bg-[#191917] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b48a]">
              Admin review
            </p>
            <p className="mt-1 text-sm text-[#d6d2c7]">Auth placeholder: add middleware later</p>
          </div>
          <Link
            href="/"
            className="rounded-[2px] border border-white/20 px-3 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#191917]"
          >
            Public site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
