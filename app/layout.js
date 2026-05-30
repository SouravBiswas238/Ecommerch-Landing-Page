import { Oxanium, Poppins, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oxanium = Oxanium({ subsets: ["latin"], weight: ["400","600","700","800"], variable: "--font-oxanium" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-poppins" });

export const metadata = {
  title: "Good Day Restaurant — Order Food Online",
  description:
    "Order hot gourmet burgers, specialty coffee, refreshing smoothies and fresh cakes from Good Day Restaurant. Fast delivery to your door. No login needed!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${oxanium.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5F359F" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
