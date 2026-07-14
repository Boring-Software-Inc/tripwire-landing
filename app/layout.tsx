import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // TODO: replace with the real production domain before launch
  metadataBase: new URL("https://tripwire.example.com"),
  title: SITE.title,
  description: SITE.description,
  openGraph: {
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
    // suppressHydrationWarning: the inline script below adds the `js` class before hydration
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        {/* Marks JS as available so reveal animations can hide content pre-scroll (see globals.css) */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
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
