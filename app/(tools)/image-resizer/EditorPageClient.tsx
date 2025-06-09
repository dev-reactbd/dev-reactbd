"use client";

import { ImageEditor } from "@/components/image-editor/imageEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function EditorPageClient() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Online Image Editor",
            url: "https://image-converter.reactbd.com/editor",
            description:
              "Professional online image editor with crop, resize, rotate, flip, and filter tools. Edit images instantly in your browser.",
            applicationCategory: "PhotographyApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Crop images with aspect ratios",
              "Resize and rotate images",
              "Apply filters and effects",
              "Brightness and contrast adjustment",
              "Real-time image editing",
              "Undo/redo functionality",
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    aria-label="Back to image converter"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-300 hidden sm:block" />
                <h1 className="text-lg font-semibold text-gray-900">
                  Online Image Editor
                </h1>
              </div>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  aria-label="Go to homepage"
                >
                  <Home className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Editor */}
        <main className="container mx-auto px-2 sm:px-4 py-3">
          <ImageEditor />
        </main>
      </div>
    </>
  );
}
