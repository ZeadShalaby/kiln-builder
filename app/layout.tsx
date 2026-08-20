import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiln — describe it, we'll forge it",
  description:
    "Describe what you want to build, pick your integrations, and Kiln drafts the plan — powered by Claude.",
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
