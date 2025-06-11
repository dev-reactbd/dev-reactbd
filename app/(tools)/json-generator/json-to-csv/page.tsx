import type { Metadata } from "next";
import JSONToCSVClient from "./JSONToCSVClient";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Convert JSON Arrays to CSV | JSON Tools",
  description:
    "Convert JSON arrays to CSV format for data analysis and spreadsheet import. Free online JSON to CSV converter with download options and custom formatting.",
  keywords: [
    "json to csv",
    "convert json to csv",
    "json csv converter",
    "json array to csv",
    "json data export",
    "csv converter",
    "json spreadsheet",
    "data conversion",
    "json export",
    "csv download",
  ],
  openGraph: {
    title: "JSON to CSV Converter - Convert JSON Arrays to CSV",
    description:
      "Convert JSON arrays to CSV format for data analysis and spreadsheet import. Free online JSON to CSV converter with download options.",
    url: "https://reactbd.org/json-generator/json-to-csv",
  },
};

export default function JSONToCSVPage() {
  return (
    <>
      <PageHeader title="JSON to CSV" />
      <JSONToCSVClient />
    </>
  );
}
