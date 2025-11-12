"use client";

import React from "react";
import { AuthProvider } from "react-oidc-context";

/**
 * .env.local must define:
 * NEXT_PUBLIC_COGNITO_AUTHORITY
 * NEXT_PUBLIC_COGNITO_DOMAIN
 * NEXT_PUBLIC_COGNITO_CLIENT_ID
 * NEXT_PUBLIC_COGNITO_REDIRECT_URI
 * NEXT_PUBLIC_COGNITO_LOGOUT_URI
 * NEXT_PUBLIC_COGNITO_SCOPE
 */

const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!;
const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;
const scope = process.env.NEXT_PUBLIC_COGNITO_SCOPE || "openid email";
const logoutUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI || redirectUri;

const oidcConfig = {
  authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope,

  // Important: make react-oidc-context use Cognito Hosted UI endpoints
  metadata: {
    issuer: authority,
    authorization_endpoint: `${domain}/oauth2/authorize`,
    token_endpoint: `${domain}/oauth2/token`,
    userinfo_endpoint: `${domain}/oauth2/userInfo`,
    revocation_endpoint: `${domain}/oauth2/revoke`,
    end_session_endpoint: `${domain}/logout`,
    jwks_uri: `${authority}/.well-known/jwks.json`,
  },
};

export default function OidcProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
