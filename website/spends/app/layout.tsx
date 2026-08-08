import type { Metadata } from "next";
import { Rubik, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spends.me"),
  title: "SPENDS",
  description: "Smart Financial Management",
  openGraph: {
    title: "SPENDS",
    description: "Smart Financial Management",
    url: "https://spends.me",
    siteName: "SPENDS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPENDS",
    description: "Smart Financial Management",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}