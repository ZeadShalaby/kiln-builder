import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiln — Describe it. Integrate it. We'll build it.",
  description:
    "Tell us what you want to build and select the integrations you need. Our AI generates a plan powered by Claude.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
