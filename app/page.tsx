"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";
import ChatWidget from '@/components/ChatWidget';
import { useSearchParams } from "next/navigation";



type Role = "none" | "patient" | "clinician" | "guest";

export default function Page() {
  const auth = useAuth();
  const [showModal, setShowModal] = useState(true);

  // block scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // close modal if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) setShowModal(false);
  }, [auth.isAuthenticated]);
  // re-open modal after logout redirect (?signedout=1)
  const params = useSearchParams();

  useEffect(() => {
    if (!auth.isAuthenticated && params.get("signedout") === "1") {
      setShowModal(true);
    }
  }, [auth.isAuthenticated, params]);

  const handleSignIn = async (role: Exclude<Role, "none">) => {
    try {
      if (role === "guest") {
        setShowModal(false);
        return;
      }
      await auth.signinRedirect({ state: { role } });
    } catch (err) {
      console.error(err);
      alert("Sign-in could not start. Check your Cognito configuration.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      {/* NAV */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center font-bold">
            H
          </div>
          <span className="font-semibold text-lg">HealthConnect</span>
        </div>

        <div className="flex items-center gap-3">
          {auth.isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-maroon"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center justify-center mt-16 px-6">
        <p className="text-sm text-[var(--fg-muted)] mb-3">
          Connecting Patients & Clinicians
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
          Healthcare in
          <br />
          <span className="text-[var(--accent)] font-semibold">better hands</span>
        </h1>
        <p className="mt-6 max-w-xl text-[var(--fg-muted)]">
          Explore as a guest, or sign in to access your patient portal and
          profile. Clinicians can view incoming pre-consults and tasks.
        </p>

        <div className="mt-8 flex gap-3">
          <Link href="/patient" className="btn btn-maroon">
            Go to patient portal
          </Link>
          <Link
            href="/clinician"
            className="btn btn-outline-lavender text-[var(--fg)]"
          >
            Clinician dashboard
          </Link>
        </div>
      </section>

      {/* ROLE CHOOSER POPUP */}
      {/* ===== MODAL ===== */}
{showModal && !auth.isAuthenticated && (
  <div className="fixed inset-0 modal-scrim flex items-center justify-center z-50">
    <div className="modal-panel rounded-2xl w-[90%] max-w-xl p-7 relative animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-5 text-white">
        Who are you using this tool as?
      </h2>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleSignIn("patient")}
          className="role-row text-white"
        >
          ○ A Patient looking for guidance
        </button>

        <button
          onClick={() => handleSignIn("clinician")}
          className="role-row text-white"
        >
          ○ A Clinician supporting a patient
        </button>

        {/* Guest just closes modal */}
        <button
          onClick={() => setShowModal(false)}
          className="role-row text-white"
        >
          ○ A Guest just exploring the tool
        </button>
      </div>

      <button
        onClick={() => { setShowModal(false); }}
        className="absolute top-3 right-4 text-white/70 hover:text-white text-xl"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </div>
)}

      {/* Floating patient portal chat */}
      <ChatWidget />
    </main>
  );
}