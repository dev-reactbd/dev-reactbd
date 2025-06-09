import type { Metadata } from "next";
import JSONGeneratorClient from "./JSONGeneratorClient";

export const metadata: Metadata = {
  title: "Free JSON Data Generator - Create Fake JSON for Testing | JSON Tools",
  description:
    "Generate realistic fake JSON data with customizable fields. Create users, products, or custom objects with UUIDs, names, emails, and more. Perfect for API testing and prototyping.",
  keywords: [
    "json generator",
    "fake json data",
    "mock data generator",
    "test data generator",
    "json mock",
    "api testing data",
    "fake api data",
    "json sample data",
    "random json generator",
    "json test data",
  ],
  openGraph: {
    title: "Free JSON Data Generator - Create Fake JSON for Testing",
    description:
      "Generate realistic fake JSON data with customizable fields. Create users, products, or custom objects for API testing and prototyping.",
    url: "https://reactbd.org/json-generator",
  },
};

export default function JSONGeneratorPage() {
  return <JSONGeneratorClient />;
}
