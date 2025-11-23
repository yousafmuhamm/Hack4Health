// app/utils/logout.ts

export function cognitoLogout() {
  try {
    localStorage.removeItem("role");
    sessionStorage.removeItem("loginRole");
  } catch {
    // ignore storage errors
  }

  const domain = "https://us-west-2yshsyjevr.auth.us-west-2.amazoncognito.com";
  const clientId = "4s6jh35ds200g1abjd19pqd9gv";

  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000" // landing page in dev
      : "https://main.d2rm24vunvbzge.amplifyapp.com/"; // TODO: your real prod landing URL

  const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    redirectUri
  )}`;

  window.location.href = logoutUrl;
}
