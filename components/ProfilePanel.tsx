"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

/**
 * Side panel showing:
 * - Signed-in email (if any)
 * - Health History (stored locally for demo)
 * In production, you’d save this to your backend.
 */
export default function ProfilePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const auth = useAuth();
  const email = auth.user?.profile?.email ?? "";

  const STORAGE_KEY = "hc_health_history_v1";
  const [history, setHistory] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(saved);
    } catch {
      // ignore
    }
  }, [open]);

  const saveHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, history);
      alert("Health history saved locally (demo).");
    } catch {
      alert("Could not save locally.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">
            Patient Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close profile"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {auth.isAuthenticated ? (
            <div className="text-sm">
              <div className="text-gray-500">Signed in as</div>
              <div className="font-medium text-slate-900">{email}</div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              You’re browsing as a guest. Sign in to sync your profile in the
              future.
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Health History (optional)
            </label>
            <textarea
              className="w-full min-h-[160px] rounded-lg border border-gray-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="Allergies, medications, major surgeries, chronic conditions, etc."
            />
            <div className="flex gap-2">
              <button
                onClick={saveHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setHistory("")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Demo only: this saves to your browser storage. In production, save
              this information to your clinic’s backend/API.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
