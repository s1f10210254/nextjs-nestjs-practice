import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Shippori_Mincho,
  Zen_Kurenaido,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shipporiMincho = Shippori_Mincho({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
});

const zenKurenaido = Zen_Kurenaido({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-kurenaido",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unmute",
  description: "悩みをそっと書き残すアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${shipporiMincho.variable} ${zenKurenaido.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
