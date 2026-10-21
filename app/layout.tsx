import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { geist } from "@/lib/fonts";
import { SITE } from "@/lib/content";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tripwire.sh"),
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 622 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * Skip link: visually hidden until focused, so a keyboard user can jump
         * past the nav instead of tabbing through it on every visit.
         */}
        <a
          href="#main"
          className="skip-link rounded-tight bg-foreground px-4 py-2 text-sm font-medium text-background md:rounded-ui"
        >
          Skip to content
        </a>
        {children}
        {/* Analytics mount point: add the tracking snippet here when ready */}
      </body>
    </html>
  );
}
