import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://jsontools.dev"),
  title: {
    default: "ReactBD - Free Online JSON Generator, Formatter & Validator",
    template: "%s | JSON Tools Suite",
  },
  description:
    "Professional JSON tools suite with fake data generator, pretty formatter, validator, minifier, and CSV converter. Edit and manipulate JSON instantly in your browser.",
  applicationName: "JSON Tools Suite",
  referrer: "origin-when-cross-origin",
  keywords: [
    "json tools",
    "json generator",
    "json formatter",
    "json validator",
    "json minifier",
    "json to csv",
    "fake json data",
    "json pretty print",
    "online json editor",
    "json parser",
    "json converter",
    "json utilities",
  ],
  authors: [
    {
      name: "JSON Tools Suite",
      url: "https://reactbd.org/fake-json-generator",
    },
  ],
  creator: "JSON Tools Suite",
  publisher: "JSON Tools Suite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
