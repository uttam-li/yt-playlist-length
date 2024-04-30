import type { Metadata } from "next";
import { DM_Sans, Fira_Code, Gilda_Display, Inter, Playfair_Display, Playfair_Display_SC, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/model-toggle";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Playlist Length",
  description: "Calculate the total duration of any YouTube playlist. Just paste the playlist URL and get the total time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <div className="fixed right-5 top-5 z-[999]">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
