import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OGX Studio — Creative Developer",
  description: "Design-led product engineering. MERN, Next.js, WordPress, Shopify, Framer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
