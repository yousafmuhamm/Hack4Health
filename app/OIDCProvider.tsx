"use client";

import { AuthProvider } from "react-oidc-context";

export default function OIDCProvider({ children }: { children: React.ReactNode }) {
  const config = {
    authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    loadUserInfo: true,

    onSigninCallback: () => {
      window.history.replaceState({}, document.title, "/");
    },
  };

  return <AuthProvider {...config}>{children}</AuthProvider>;
}
