import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Medify - Your AI Healthcare Assistant",
    template: "%s | Medify",
  },
  description:
    "Revolutionizing healthcare with AI-driven solutions for personalized, accessible, and secure health management.",
  keywords: [
    "healthcare",
    "AI healthcare",
    "telemedicine",
    "digital health",
    "medical assistant",
    "patient care",
  ],
  authors: [{ name: "Medify Team" }],
  creator: "Medify",
  publisher: "Medify",
  metadataBase: new URL("https://medify-devmaxzi.vercel.app/"), // replace with your live domain
  openGraph: {
    title: "Medify - Your AI Healthcare Assistant",
    description:
      "Revolutionizing healthcare with AI-driven solutions for personalized, accessible, and secure health management.",
    url: "https://medify-devmaxzi.vercel.app/",
    siteName: "Medify",
    images: [
      {
        url: "/images/Medifyog.png", // replace with your image
        width: 1200,
        height: 630,
        alt: "Medify Healthcare Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medify - Your AI Healthcare Assistant",
    description:
      "Revolutionizing healthcare with AI-driven solutions for personalized, accessible, and secure health management.",
    images: ["/images/Medifyog.png"],
    creator: "@dev_maxzi",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunitoSans.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
