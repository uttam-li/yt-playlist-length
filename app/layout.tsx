import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/model-toggle";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://yt-playlist-length.vercel.app'),
  title: "YouTube Playlist Duration",
  description: "Effortlessly calculate the total duration of any YouTube playlist with advanced filter option and at different speeds. Simply paste the playlist URL and get the total time instantly.",
  generator: "Next.js",
  applicationName: "Youtube Playlist Duration",
  keywords: [
    "Youtube", "Youtube API Data", "Youtube Playlist Duration", "Youtube Playlist", "Youtube Length calculator", "Video Duration", "Playlist Analyzer", "Youtube Video Length", "Youtube Playlist Analyzer", "Youtube Playlist Length Calculator", "Youtube Video Duration Calculator", "Youtube Playlist Time", "Total Playlist Duration", "Youtube Time Tracker"],
  authors: [{ name: 'Uttam Likhiya', url: 'https://puli.vercel.app' }],
  openGraph: {
    title: "YouTube Playlist Duration",
    description: "Effortlessly calculate the total duration of any YouTube playlist with advanced filter option and at different speeds. Simply paste the playlist URL and get the total time instantly.",
    url: 'https://yt-playlist-length.vercel.app',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    card: 'summary',
    title: "YouTube Playlist Duration",
    description: "Effortlessly calculate the total duration of any YouTube playlist with advanced filter option and at different speeds. Simply paste the playlist URL and get the total time instantly.",
    creator: 'Uttam Likhiya',
    creatorId: '@L1KH1YAUTTAM',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={`${inter.className} relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <div className="fixed right-5 top-5 z-[999]">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
