"use client";

import { useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "next/link";

export default function ProfileMenu() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  if (!auth.isAuthenticated) return null;

  const name =
    (auth.user?.profile?.name as string) ||
    (auth.user?.profile?.email as string) ||
    "Profile";

  const handleSignOut = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const logoutUri =
      process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI ||
      process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--chip)] text-[var(--chipText)] font-medium"
      >
        <div className="w-7 h-7 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block">{name}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl card overflow-hidden bg-[var(--surface)]"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href="/profile"
            className="block px-4 py-3 hover:bg-[var(--bg-muted)]"
          >
            Profile & Medical History
          </Link>
          <Link
            href="/patient"
            className="block px-4 py-3 hover:bg-[var(--bg-muted)]"
          >
            Patient portal
          </Link>
          <Link
            href="/clinician"
            className="block px-4 py-3 hover:bg-[var(--bg-muted)]"
          >
            Clinician dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-3 hover:bg-[var(--bg-muted)] text-[var(--brand-maroon)] font-semibold"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
