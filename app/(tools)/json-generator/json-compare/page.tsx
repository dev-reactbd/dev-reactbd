import type { Metadata } from "next";
import JSONCompareClient from "./JSONCompareClient";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "JSON Compare Tool - Compare JSON Files & Objects Online | JSON Tools",
  description:
    "Compare two JSON files or objects to find differences, missing keys, and similarities. Professional JSON comparison tool with detailed analysis, syntax highlighting, and export options.",
  keywords: [
    "json compare",
    "json diff",
    "compare json files",
    "json difference",
    "json comparison tool",
    "json merge",
    "json analyzer",
    "json object compare",
    "json file diff",
    "json structure compare",
    "json key comparison",
    "json value comparison",
  ],
  openGraph: {
    title: "JSON Compare Tool - Compare JSON Files & Objects Online",
    description:
      "Compare two JSON files or objects to find differences, missing keys, and similarities. Professional JSON comparison tool with detailed analysis.",
    url: "https://reactbd.org/json-generator/json-compare",
  },
};

export default function JSONComparePage() {
  return (
    <>
      <PageHeader title="JSON Compare" />
      <JSONCompareClient />
    </>
  );
}
