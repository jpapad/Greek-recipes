import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Traditional Greek Recipes",
    template: "%s | Greek Recipes",
  },
  description: "Discover authentic Greek cuisine with our curated collection of recipes.",
  openGraph: {
    title: "Traditional Greek Recipes",
    description: "Discover authentic Greek cuisine with our curated collection of recipes.",
    url: "https://greek-recipes.com",
    siteName: "Greek Recipes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traditional Greek Recipes",
    description: "Discover authentic Greek cuisine with our curated collection of recipes.",
  },
};

import { ShoppingListProvider } from "@/context/ShoppingListContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ShoppingListProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <Footer />
        </ShoppingListProvider>
      </body>
    </html>
  );
}
