"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";
import ChatWidget from "@/components/ChatWidget";
import { useSearchParams, useRouter } from "next/navigation";

type Role = "none" | "patient" | "clinician" | "guest";

export default function Page() {
  const auth = useAuth();
  const [showModal, setShowModal] = useState(false); //made it false from true. change back to true after
  const [signInOnly, setSignInOnly] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  const role: Role = (auth.user?.profile?.role as Role) ?? "none";

  // block scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // handle query params (signinOnly + signedout)
  useEffect(() => {
    const signedOut = params.get("signedout") === "1";
    const signinOnlyParam = params.get("signinOnly") === "1";

    if (!auth.isAuthenticated && (signedOut || signinOnlyParam)) {
      //setShowModal(true);
      setSignInOnly(signinOnlyParam);
    }
  }, [auth.isAuthenticated, params]);

  // close modal if already authenticated AND redirect based on role
  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isAuthenticated) {
      setShowModal(false);
      if (role === "clinician") {
        router.replace("/clinician");
      } else if (role === "patient") {
        router.replace("/patient");
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, role, router]);

  const handleSignIn = async (roleToUse: Exclude<Role, "none">) => {
    try {
      if (roleToUse === "guest") {
        setShowModal(false);
        router.push("/guest");
        return;
      }
      await auth.signinRedirect({ state: { role: roleToUse } });
    } catch (err) {
      console.error(err);
      alert("Sign-in could not start. Check your Cognito configuration.");
    }
  };

  const openFullModal = () => {
    setSignInOnly(false);
    setShowModal(true);
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
            <button onClick={openFullModal} className="btn btn-maroon">
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center justify-center mt-16 px-6">
        <p className="text-sm text-[var(--fg-muted)] mb-3">
          Connecting Patients &amp; Clinicians
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
          Healthcare in
          <br />
          <span className="text-[var(--accent)] font-semibold">
            better hands
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-[var(--fg-muted)]">
          Explore the experience as a guest, or sign in to access your patient
          portal. Clinicians can view structured pre-consults and screening
          tasks that support safer, more efficient care.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {/* 1. Patient Portal = solid maroon */}
          <Link href="/patient" className="btn btn-maroon">
            Patient Portal
          </Link>

          {/* 2. Health education = lavender outline */}
          <Link
            href="/education"
            className="btn btn-outline-lavender text-[var(--fg)]"
          >
            Health education
          </Link>

          {/* 4. Clinician dashboard = solid maroon, clinicians only */}
          {role === "clinician" && (
            <Link href="/clinician" className="btn btn-maroon">
              Clinician dashboard
            </Link>
          )}
        </div>
      </section>

      {/* ROLE CHOOSER POPUP */}
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

              {/* Guest option only when not in sign-in-only mode */}
              {!signInOnly && (
                <button
                  onClick={() => handleSignIn("guest")}
                  className="role-row text-white"
                >
                  ○ A Guest just exploring the tool
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setShowModal(false);
              }}
              className="absolute top-3 right-4 text-white/70 hover:text-white text-xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Floating CareQuest AI chat */}
      <ChatWidget />
    </main>
  );
}
