import type { Metadata } from "next";
import JSONFormatterClient from "./JSONFormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter & Pretty Printer - Format JSON Online | JSON Tools",
  description:
    "Format and beautify JSON with syntax highlighting. Upload JSON files or paste raw JSON to get pretty-printed, readable output. Free online JSON formatter with copy and download options.",
  keywords: [
    "json formatter",
    "json pretty print",
    "json beautifier",
    "format json online",
    "json syntax highlighting",
    "json viewer",
    "json editor",
    "pretty json",
    "json indent",
    "json organizer",
  ],
  openGraph: {
    title: "JSON Formatter & Pretty Printer - Format JSON Online",
    description:
      "Format and beautify JSON with syntax highlighting. Upload JSON files or paste raw JSON to get pretty-printed, readable output.",
    url: "https://reactbd.org/json-generator-formatter",
  },
};

export default function JSONFormatterPage() {
  return <JSONFormatterClient />;
}
