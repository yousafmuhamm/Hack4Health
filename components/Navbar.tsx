// components/Navbar.tsx

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-sky-400">
          CareCompass<span className="text-slate-300"> AI</span>
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="hover:text-sky-300 text-slate-200">
            Home
          </Link>
          <Link
            href="/patient"
            className="hover:text-sky-300 text-slate-200"
          >
            Patient
          </Link>
          <Link
            href="/clinician"
            className="hover:text-sky-300 text-slate-200"
          >
            Clinician
          </Link>
        </div>
      </nav>
    </header>
  );
}
