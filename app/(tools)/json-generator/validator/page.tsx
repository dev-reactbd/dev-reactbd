import type { Metadata } from "next";
import JSONValidatorClient from "./JSONValidatorClient";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "JSON Validator - Validate JSON Syntax Online | JSON Tools",
  description:
    "Validate JSON syntax with detailed error messages. Check if your JSON is valid and get specific error locations and descriptions. Free online JSON validation tool.",
  keywords: [
    "json validator",
    "validate json",
    "json syntax checker",
    "json validation",
    "check json",
    "json error checker",
    "json lint",
    "json syntax validation",
    "json parser",
    "json verification",
  ],
  openGraph: {
    title: "JSON Validator - Validate JSON Syntax Online",
    description:
      "Validate JSON syntax with detailed error messages. Check if your JSON is valid and get specific error locations and descriptions.",
    url: "https://reactbd.org/json-generator/validator",
  },
};

export default function JSONValidatorPage() {
  return (
    <>
      <PageHeader title="JSON Validator" />
      <JSONValidatorClient />
    </>
  );
}
