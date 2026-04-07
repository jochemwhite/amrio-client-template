import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CMS Starter",
    template: "%s | CMS Starter",
  },
  description: "Reusable Next.js starter for CMS-driven client websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="relative min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
