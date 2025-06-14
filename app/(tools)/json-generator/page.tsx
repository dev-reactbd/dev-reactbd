import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/common/container";
import JSONCard from "@/components/pages/tools/JSONCard";

export const metadata: Metadata = {
  title: "JSON Tools Suite - Free Online JSON Generator, Formatter & Validator",
  description:
    "Professional JSON tools suite with fake data generator, pretty formatter, validator, minifier, and CSV converter. Edit and manipulate JSON instantly in your browser. No registration required - completely free and secure.",
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
    "free json tools",
    "browser json tools",
    "json manipulation",
    "json syntax validator",
    "mock data generator",
    "test data generator",
    "json beautifier",
    "json compressor",
  ],
  openGraph: {
    title:
      "JSON Tools Suite - Free Online JSON Generator, Formatter & Validator",
    description:
      "Professional JSON tools suite with fake data generator, pretty formatter, validator, minifier, and CSV converter. Edit and manipulate JSON instantly in your browser.",
    url: "https://reactbd.org/json-generator",
    siteName: "JSON Tools Suite",
    images: [
      {
        url: "/placeholder.svg?height=1200&width=630&text=JSON+Tools+Suite",
        width: 1200,
        height: 630,
        alt: "JSON Tools Suite - Professional JSON utilities for developers",
      },
    ],
  },
};

export default function FakeJson() {
  return (
    <Container className="space-y-12 py-10">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          JSON Tools Suite
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive collection of professional JSON utilities for
          developers. Generate, format, validate, and convert JSON data with
          ease.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-muted px-4 py-2 rounded-full text-sm">
            ✨ No Registration Required
          </div>
          <div className="bg-muted px-4 py-2 rounded-full text-sm">
            🔒 Completely Secure
          </div>
          <div className="bg-muted px-4 py-2 rounded-full text-sm">
            ⚡ Lightning Fast
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <JSONCard />

      {/* Features Section */}
      <div className="bg-muted/50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose JSON Tools Suite?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <div className="text-3xl">🚀</div>
            <h3 className="font-semibold">Fast & Efficient</h3>
            <p className="text-sm text-muted-foreground">
              Process JSON data instantly without delays
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl">🔒</div>
            <h3 className="font-semibold">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              All processing happens in your browser
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl">📱</div>
            <h3 className="font-semibold">Mobile Friendly</h3>
            <p className="text-sm text-muted-foreground">
              Works perfectly on all devices
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl">💡</div>
            <h3 className="font-semibold">Developer Focused</h3>
            <p className="text-sm text-muted-foreground">
              Built by developers, for developers
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose any tool above to begin working with JSON data. All tools are
          free, secure, and require no registration.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/json-generator">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Generate JSON Data
            </Button>
          </Link>
          <Link href="/json-formatter">
            <Button size="lg" variant="outline">
              Format JSON
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
