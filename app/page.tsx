"use client";

import React, { useState, useEffect } from "react";

const Page: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [role, setRole] = useState<"none" | "patient" | "clinician">("none");

  // optional fade-in effect
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#e6efff] text-gray-900 font-sans flex flex-col">
      {/* ===== NAVBAR ===== */}
      <nav className="w-full flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="font-semibold text-lg tracking-tight">HealthConnect</span>
        </div>

        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <li className="hover:text-gray-900 cursor-pointer">Home</li>
          <li className="hover:text-gray-900 cursor-pointer">About</li>
          <li className="hover:text-gray-900 cursor-pointer">Support</li>
        </ul>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition">
          Contact
        </button>
      </nav>

      {/* ===== HERO ===== */}
      <section className="flex flex-col items-center text-center justify-center mt-24 px-6">
        <p className="text-sm text-gray-500 mb-3">Connecting Patients & Clinicians</p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
          Healthcare in
          <br />
          <span className="text-gray-500 font-medium">better hands</span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-lg">
          A secure platform that connects patients and healthcare professionals for efficient care and collaboration.
        </p>
      </section>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center relative animate-fadeIn">
            {role === "none" && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Who are you?
                </h2>
                <p className="text-gray-600 mb-6">
                  Please select your role to continue.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setRole("patient")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition"
                  >
                    I’m a Patient
                  </button>
                  <button
                    onClick={() => setRole("clinician")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-full font-medium transition"
                  >
                    I’m a Clinician
                  </button>
                </div>
              </>
            )}

            {role === "patient" && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Patient Sign-In
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowModal(false);
                  }}
                  className="flex flex-col gap-4 text-left"
                >
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="patient@email.com"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}

            {role === "clinician" && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Clinician Sign-In
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowModal(false);
                  }}
                  className="flex flex-col gap-4 text-left"
                >
                  <label className="text-sm font-medium text-gray-700">
                    Clinician ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CLN-10052"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}

            {/* close button */}
            <button
              onClick={() => {
                setShowModal(false);
                setRole("none");
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
