import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export function useRequireAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to AWS Cognito Hosted UI if not signed in
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth]);

  return auth;
}
