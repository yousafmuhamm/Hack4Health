import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import OidcProvider from "./providers/oidc-provider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "HealthConnect",
  description: "Patients & clinicians portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>
        <OidcProvider>{children}</OidcProvider>
      </body>
    </html>
  );
}
