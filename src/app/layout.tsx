import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // you can choose the weights you need
  variable: "--font-poppins", // custom CSS variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medify - Your AI Healthcare Assistant",
  description:
    "Revolutionizing healthcare with AI-driven solutions for personalized, accessible, and secure health management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
