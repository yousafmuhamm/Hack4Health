"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfilePanel from "./ProfilePanel";

/* -----------------------------
   AWS Cognito Logout Function
------------------------------ */
function cognitoLogout() {
  try {
    localStorage.removeItem("role");
  } catch {}

  const domain = "https://us-west-2yshsyjevr.auth.us-west-2.amazoncognito.com";
  const clientId = "4s6jh35ds200g1abjd19pqd9gv";

  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://main.d2rm24vunvbzge.amplifyapp.com";

  const logoutUrl =
    `${domain}/logout?client_id=${clientId}` +
    `&logout_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = logoutUrl;
}

export default function ProfileMenu() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // READ ROLE FROM LOCALSTORAGE
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const isClinician = role === "clinician";
  const isPatient = role === "patient";

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
              onClick={cognitoLogout}
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
