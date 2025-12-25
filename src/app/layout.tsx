import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/provider";
import { Toaster } from "sonner";
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloak | Anonymous Messaging",
  description: "Send and receive secret feedback anonymously.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{backgroundColor:"#0F1115",color:"#E6E8EB"}}
      >
        <Navbar/>
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
