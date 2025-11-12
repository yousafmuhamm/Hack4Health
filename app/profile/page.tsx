"use client";

import { useAuth } from "react-oidc-context";
import Link from "next/link";
import MedicalHistoryCard from "@/components/MedicalHistoryCard";

export default function ProfilePage() {
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center font-bold">
            P
          </div>
          <span className="font-semibold">Profile</span>
        </div>
        <Link href="/" className="text-[var(--fg-muted)] hover:underline">
          Home
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-12 space-y-6">
        <section className="card p-4">
          <h1 className="text-xl font-semibold mb-2">Account</h1>
          {auth.isAuthenticated ? (
            <div className="text-sm">
              <div><span className="font-medium">Email:</span> {auth.user?.profile?.email}</div>
              <div><span className="font-medium">Name:</span> {auth.user?.profile?.name ?? "—"}</div>
              <p className="text-[var(--fg-muted)] mt-2">
                To edit Cognito attributes (name, email, etc.), use your hosted
                UI’s profile page or a backend that calls Cognito AdminUpdateUserAttributes.
              </p>
            </div>
          ) : (
            <button onClick={() => auth.signinRedirect()} className="btn btn-maroon">
              Sign in to view profile
            </button>
          )}
        </section>

        <MedicalHistoryCard />
      </main>
    </div>
  );
}
