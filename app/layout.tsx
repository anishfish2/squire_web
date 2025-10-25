import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squire - Your AI-Powered Assistant",
  description: "Join the waitlist for the next generation AI assistant that helps you accomplish more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}