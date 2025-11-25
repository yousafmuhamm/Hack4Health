// app/utils/logout.ts

export function cognitoLogout() {
  try {
    localStorage.removeItem("role");
    sessionStorage.removeItem("loginRole");
  } catch {
    // ignore storage errors
  }

  const domain = "https://us-west-2yshsyjevr.auth.us-west-2.amazoncognito.com";
  const clientId = "2hac1oa1g8c6hb244a6r7t986p";

  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000" // landing page in dev
      : "https://hack4-health.vercel.app"; // TODO: your real prod landing URL

  const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    redirectUri
  )}`;

  window.location.href = logoutUrl;
}
