import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squire",
  description: "Record. Upload. Automate.",
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
