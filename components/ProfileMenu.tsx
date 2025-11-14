"use client";

import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import ProfilePanel from "./ProfilePanel";

export default function ProfileMenu() {
  const auth = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const role = (auth.user?.profile?.role as string) ?? "";
  const isClinician = role === "clinician";
  const isPatient = role === "patient";

  const handleSignOut = () => {
    if (!auth.signoutRedirect) return;
    auth.signoutRedirect({
      post_logout_redirect_uri: `${window.location.origin}/?signedout=1`,
    });
  };

  const goPatient = () => {
    setMenuOpen(false);
    router.push("/patient");
  };

  const goClinician = () => {
    setMenuOpen(false);
    router.push("/clinician");
  };

  const openProfilePanel = () => {
    setMenuOpen(false);
    setPanelOpen(true);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-maroon)] text-white text-xs font-semibold">
            P
          </span>
          <span>Profile</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg text-sm text-slate-800 z-50">
            <button
              onClick={openProfilePanel}
              className="w-full text-left px-3 py-2 hover:bg-slate-50"
            >
              Profile
            </button>

            {isPatient && (
              <button
                onClick={goPatient}
                className="w-full text-left px-3 py-2 hover:bg-slate-50"
              >
                Patient Portal
              </button>
            )}

            {isClinician && (
              <button
                onClick={goClinician}
                className="w-full text-left px-3 py-2 hover:bg-slate-50"
              >
                Clinician dashboard
              </button>
            )}

            <div className="border-t border-slate-200 my-1" />

            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <ProfilePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
