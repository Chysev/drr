import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./MapStyles.css";

export const dynamic = "force-dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pag-uulat ng Sakuna",
  description:
    "Gumawa ng ulat sa pamamagitan ng pagpili ng lokasyon, paglagay ng paglalarawan, at pag-upload ng larawan. Manatiling may alam sa mga kasalukuyang sakuna at tingnan ang mga ulat mula sa iba.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
