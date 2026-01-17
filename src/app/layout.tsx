import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "ClothesReview - Yelp for Clothes",
  description: "Find and review your favorite clothing items",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
