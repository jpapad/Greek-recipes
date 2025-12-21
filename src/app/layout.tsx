import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import StyleInjector from "@/components/layout/StyleInjector";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/ui/toast";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { Snowfall } from "@/components/ui/Snowfall";
import Script from "next/script";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

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
    default: "Greek Recipes - Authentic Traditional Greek Cuisine",
    template: "%s | Greek Recipes",
  },
  description: "Discover authentic Greek cuisine with our curated collection of traditional recipes from all regions of Greece. Moussaka, Souvlaki, Spanakopita and more!",
  keywords: ["Greek recipes", "traditional Greek food", "Mediterranean cuisine", "Greek cooking", "authentic recipes", "Moussaka", "Souvlaki", "Greek diet"],
  authors: [{ name: "Greek Recipes" }],
  creator: "Greek Recipes",
  publisher: "Greek Recipes",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Add a version query param to the manifest to force a fresh fetch
  // when service workers or caches had previously stored a 401 response.
  manifest: "/manifest.json?v=2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Greek Recipes",
  },
  openGraph: {
    title: "Greek Recipes - Authentic Traditional Greek Cuisine",
    description: "Discover authentic Greek cuisine with our curated collection of traditional recipes from all regions of Greece.",
    url: "https://greek-recipes.com",
    siteName: "Greek Recipes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Greek Recipes - Traditional Cuisine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greek Recipes - Authentic Traditional Greek Cuisine",
    description: "Discover authentic Greek cuisine with our curated collection of traditional recipes.",
    images: ["/twitter-image.jpg"],
    creator: "@greekrecipes",
  },
  alternates: {
    canonical: "https://greek-recipes.com",
    languages: {
      'en-US': '/en',
      'el-GR': '/el',
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "food",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <StyleInjector />
          <LoadingScreen />
          <Snowfall />
          <ThemeProvider>
            <ToastProvider>
              <ShoppingListProvider>
                <MealPlanProvider>
                  <Navbar />
                  <main className="flex-grow pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto w-full">
                    {children}
                  </main>
                  <Footer />
                  <PWAInstallPrompt />
                </MealPlanProvider>
              </ShoppingListProvider>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Service Worker Registration (PROD only) */}
        {process.env.NODE_ENV === "production" && (
          <Script id="register-sw" strategy="afterInteractive">
            {`
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((registration) => {
              console.log('SW registered: ', registration);
            })
            .catch((error) => {
              console.log('SW registration failed: ', error);
            });
        });
      }
    `}
          </Script>
        )}
      </body>
    </html>
  );
}
