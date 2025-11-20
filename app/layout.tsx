import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Integration Portal & Agent Router",
  description: "Configure integrations and test routing agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-slate-900">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
