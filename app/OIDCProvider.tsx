"use client";

import { AuthProvider } from "react-oidc-context";

export default function OIDCProvider({ children }: { children: React.ReactNode }) {
  const config = {
    authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY!,
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",

    loadUserInfo: true,

    onSigninCallback: (user: any) => {
      // ---- Read state coming back from signinRedirect ----
      const state = (user?.state ?? {}) as any;

      const stateRole = (state.role ?? "").toString().toLowerCase();
      const stateReturnPath =
        typeof state.returnPath === "string" ? state.returnPath : undefined;

      // Optional: role from Cognito custom attribute
      const cognitoRole = (
        user?.profile?.["custom:role"] ?? ""
      )
        .toString()
        .toLowerCase();

      // Prefer Cognito role, then state role
      const role = (cognitoRole || stateRole || "").toLowerCase();

      if (role) {
        sessionStorage.setItem("loginRole", role);
      }

      // Fallback based on role if we *don't* have an explicit returnPath
      const fallbackFromRole =
        role === "clinician"
          ? "/clinician"
          : role === "patient"
          ? "/patient"
          : "/";

      const redirectPath = stateReturnPath || fallbackFromRole;

      console.log("onSigninCallback => state:", state);
      console.log("onSigninCallback => role:", role, "redirectPath:", redirectPath);

      // Navigate there (also clears ?code=... from URL)
      window.location.replace(redirectPath);
    },
  };

  return <AuthProvider {...config}>{children}</AuthProvider>;
}
