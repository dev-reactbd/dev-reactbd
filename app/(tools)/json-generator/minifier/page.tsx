import type { Metadata } from "next";
import JSONMinifierClient from "./JSONMinifierClient";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "JSON Minifier - Compress JSON Online | JSON Tools",
  description:
    "Minify and compress JSON by removing unnecessary whitespace and formatting. Reduce JSON file size for production use. Free online JSON compression tool.",
  keywords: [
    "json minifier",
    "json compressor",
    "minify json",
    "compress json",
    "json optimizer",
    "reduce json size",
    "json compression",
    "compact json",
    "json size reducer",
    "json whitespace remover",
  ],
  openGraph: {
    title: "JSON Minifier - Compress JSON Online",
    description:
      "Minify and compress JSON by removing unnecessary whitespace and formatting. Reduce JSON file size for production use.",
    url: "https://reactbd.org/json-generator/minifier",
  },
};

export default function JSONMinifierPage() {
  return (
    <>
      <PageHeader title="JSON Minifier" />
      <JSONMinifierClient />
    </>
  );
}
