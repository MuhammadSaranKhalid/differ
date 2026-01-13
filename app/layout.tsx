import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "JSON Differ - Compare, Convert & Validate JSON/YAML/XML Online Free",
    template: "%s | JSON Differ"
  },
  description: "Free online JSON diff tool with privacy-first approach. Compare JSON files, convert JSON/YAML/XML, validate JSON schema, and format JSON. No login required. Used by 50,000+ developers.",
  keywords: [
    "json diff",
    "json compare",
    "json difference",
    "compare json online",
    "json diff tool",
    "json validator",
    "json formatter",
    "json beautifier",
    "json to yaml",
    "yaml to json",
    "json to xml",
    "xml to json",
    "json schema validator",
    "api response diff",
    "package json compare",
    "kubernetes yaml diff",
    "compare config files",
    "json merge tool",
    "online json diff",
    "free json compare"
  ],
  authors: [{ name: "JSON Differ Team" }],
  creator: "JSON Differ",
  publisher: "JSON Differ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "JSON Differ - Professional JSON Compare & Diff Tool",
    description: "Compare JSON files instantly with our privacy-first online tool. Features include JSON validation, format conversion, schema validation, and more. Free forever.",
    siteName: "JSON Differ",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "JSON Differ - Compare JSON Files Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Differ - Compare & Validate JSON Online",
    description: "Free JSON diff tool with privacy-first design. Compare, convert, and validate JSON/YAML/XML instantly in your browser.",
    images: [`${defaultUrl}/twitter-image.png`],
    creator: "@jsondiff", // Replace with your actual Twitter handle
  },
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
  alternates: {
    canonical: defaultUrl,
  },
  category: "technology",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
