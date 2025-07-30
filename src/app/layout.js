import { Geist, Geist_Mono , Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
}); 

export const metadata = {
  title: "Viboscope",
  description: "Upload any screenshot and let AI instantly detect the emotional vibe — toxic, wholesome, chaotic, or just ✨unhinged✨.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://ik.imagekit.io/dvjwbf9tt/viboscope1.png?updatedAt=1750294423196"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        </head>

      <body
        className={` ${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
