import type { Metadata } from "next";
import { Roboto, Caveat, Alex_Brush } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

const caveat = Caveat({
  weight: ['600', '700'],
  variable: "--font-caveat",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: ['400'],
  variable: "--font-signature",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVMLabs | Clinical Reference Laboratory & Diagnostic Services",
  description: "Book tests, health checkup packages, and access digital reports online with AVMLabs India.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${caveat.variable} ${alexBrush.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
