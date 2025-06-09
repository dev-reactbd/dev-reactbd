import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Head from "next/head";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s - ReactBD",
    default: "ReactBD - Technologies",
  },
  description:
    "Software Development Services. We are a top-notch software development company that can help you define your brand and increase your revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GADSENSE_CLIENT_ID = "ca-pub-6542623777003381";
  return (
    <html lang="en">
      <Head>
        <meta name="google-adsense-account" content={GADSENSE_CLIENT_ID} />
      </Head>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GADSENSE_CLIENT_ID}`}
        strategy="beforeInteractive"
      />
      <body className={`antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
