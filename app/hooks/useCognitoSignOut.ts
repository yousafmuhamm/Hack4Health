// hooks/useCognitoSignOut.ts (or inline in page.tsx)
import { useAuth } from "react-oidc-context";

export function useCognitoSignOut() {
  const auth = useAuth();
  const domain   = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
  const logoutUi = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI!;

  const signOut = async () => {
    const postUri = `${logoutUi}?signedout=1`; // <-- flag so we reopen the modal on return

    try {
      await auth.signoutRedirect({ post_logout_redirect_uri: postUri });
    } catch (e) {
      // fallback: clear local user and force Hosted UI logout
      try { await auth.removeUser(); } catch {}
      window.location.href =
        `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(postUri)}`;
    }
  };

  return signOut;
}
