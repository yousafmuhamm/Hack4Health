export function cognitoLogout() {
  // Clear local role and any app state
  try {
    localStorage.removeItem("role");
  } catch {}

  const domain = "https://us-west-2frgg6bipo.auth.us-west-2.amazoncognito.com";
  const clientId = "4s6jh35ds200g1abjd19pqd9gv";

  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000/"
      : "https://example.com/"; // UPDATE when you deploy

  const logoutUrl =
    `${domain}/logout?` +
    `client_id=${clientId}` +
    `&logout_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = logoutUrl;
}
