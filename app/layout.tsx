import type { Metadata } from "next";
import { Inter_Tight, Style_Script } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { htmlLangForLocale } from "@/i18n/routing";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
});

const styleScript = Style_Script({
  variable: "--font-style-script",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={htmlLangForLocale(locale)} suppressHydrationWarning>
      <body
        className={`${interTight.variable} ${styleScript.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
